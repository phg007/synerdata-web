import { GetUserResponse } from "@/app/(private)/usuarios/services/get-users";
import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";

export async function updateFirstAccess(userId: string) {
  try {
    const response = await fetchClient(
      `v1/usuarios/${userId}/atualizar-primeiro-acesso`,
      {
        method: "PATCH",
        body: JSON.stringify({ primeiroAcesso: false }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro criar a filial."
      );
    }

    return (await response.json()) as ApiResponse<GetUserResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar a filial.", error);
    throw error;
  }
}
