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
    const response = await fetch(
      "http://localhost:3001/api/v1/auth/recovery-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

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
