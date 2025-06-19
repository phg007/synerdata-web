export interface ResetPasswordResponse {
  succeeded: boolean;
  data: null;
  message: string;
  error: {
    message: string;
    error: string;
    statusCode: number;
  };
}

export interface ResetPasswordBody {
  recoveryToken: string;
  password: string;
}

export async function resetPassword({
  password,
  recoveryToken,
}: ResetPasswordBody) {
  try {
    const response = await fetch("/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        novaSenha: password,
        recoveryToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message ||
          "Ocorreu um erro ao tentar redefinir a senha."
      );
    }

    const resetPasswordResponse: ResetPasswordResponse = await response.json();

    return resetPasswordResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao tentar redefinir a senha.", error);
    throw error;
  }
}
