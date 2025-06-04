import { fetchClient } from "@/utils/fetch-client";

export interface DeleteUserPayload {
  userId: string;
}

interface GetUserResponse {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  status: string;
  empresa: string;
  criadoPor: string | null;
}

export interface DeleteUserResponse {
  succeeded: boolean;
  data: GetUserResponse | null;
  message: string;
}

export async function deleteUser({
  userId,
}: DeleteUserPayload): Promise<DeleteUserResponse> {
  try {
    const response = await fetchClient(`v1/usuarios/${userId}`, {
      method: "DELETE",
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao excluir o usuário."
      );
    }

    const deleteUserResponse: DeleteUserResponse = await response.json();

    return deleteUserResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir o usuário.", error);
    throw error;
  }
}
