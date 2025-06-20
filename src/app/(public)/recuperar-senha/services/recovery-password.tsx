import { fetchClient } from "@/utils/fetch-client";

export interface RecoveryPasswordResponse {
  succeeded: boolean;
  data: null;
  message: string;
  error: {
    message: string;
    error: string;
    statusCode: number;
  };
}

export interface RecoveryPasswordBody {
  email: string;
}

export async function recoveryPassword({ email }: RecoveryPasswordBody) {
  try {
    const response = await fetchClient("/v1/auth/recovery-password", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message ||
          "Ocorreu um erro ao tentar recuperar a senha."
      );
    }

    const recoveryPasswordResponse: RecoveryPasswordResponse =
      await response.json();

    return recoveryPasswordResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao tentar recuperar a senha.", error);
    throw error;
  }
}
