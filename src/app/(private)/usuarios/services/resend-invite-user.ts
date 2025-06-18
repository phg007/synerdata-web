import { fetchClient } from "@/utils/fetch-client";

export interface ResendInviteUserPayload {
  email: string;
}

export interface ResendInviteUserResponse {
  succeeded: boolean;
  data: null;
  message: string;
}

export async function resendInviteUser({
  email,
}: ResendInviteUserPayload): Promise<ResendInviteUserResponse> {
  try {
    const response = await fetchClient("v1/auth/resend-invite", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message ||
          "Ocorreu um erro ao reenviar o convite para o usuário."
      );
    }

    const resendInviteUserResponse: ResendInviteUserResponse =
      await response.json();

    return resendInviteUserResponse;
  } catch (error) {
    console.error(
      "Ocorreu um erro ao reenviar o convite para o usuário.",
      error
    );
    throw error;
  }
}
