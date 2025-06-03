import { fetchClient } from "@/utils/fetch-client";

interface GetUserResponse {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  status: string;
  empresa: string;
  criadoPor: string | null;
}

export interface UpdateUserPayload {
  userId: string;
  funcao: string;
}

export interface UpdateUserResponse {
  succeeded: boolean;
  data: GetUserResponse | null;
  message: string;
}

export async function updateUser({
  userId,
  funcao,
}: UpdateUserPayload): Promise<UpdateUserResponse> {
  try {
    const response = await fetchClient(`v1/usuarios/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({
        funcao,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao atualizar o usuário."
      );
    }

    const activateAccountResponse: UpdateUserResponse = await response.json();

    return activateAccountResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar o usuário.", error);
    throw error;
  }
}
