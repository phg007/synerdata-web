import { fetchClient } from "@/utils/fetch-client";

export interface InviteUserPayload {
  email: string;
  funcao: string;
  empresaId: string;
}

export interface InviteUserResponse {
  succeeded: boolean;
  data: null;
  message: string;
}

export async function inviteUser({
  email,
  funcao,
  empresaId,
}: InviteUserPayload): Promise<InviteUserResponse> {
  try {
    const response = await fetchClient(`v1/auth/invite/${empresaId}`, {
      method: "POST",
      body: JSON.stringify({
        email,
        funcao,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao convidar o usuário."
      );
    }

    const inviteUserResponse: InviteUserResponse = await response.json();

    return inviteUserResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao convidar o usuário.", error);
    throw error;
  }
}
