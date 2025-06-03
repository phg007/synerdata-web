import { fetchClient } from "@/utils/fetch-client";

interface ActivateAccountData {
  id: string;
}

export interface ActivateAccountResponse {
  succeeded: boolean;
  data: ActivateAccountData | null;
  message: string;
  error: {
    message: string;
    error: string;
    statusCode: number;
  };
}

export interface ActivateAccountBody {
  nome: string;
  email: string;
  password: string;
  activationToken: string;
}

export async function activateAccount({
  nome,
  email,
  password,
  activationToken,
}: ActivateAccountBody) {
  try {
    const response = await fetchClient("v1/auth/activate-account", {
      method: "POST",
      body: JSON.stringify({
        nome,
        email,
        senha: password,
        activationToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao tentar ativar a conta."
      );
    }

    const activateAccountResponse: ActivateAccountResponse =
      await response.json();

    return activateAccountResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao tentar ativar a conta.", error);
    throw error;
  }
}
