import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { CboObjectResponse } from "../interfaces/cbo-interface";

export interface UpdateCboPayload {
  nome: string;
  cboId: string;
}

export async function updateCbo({ nome, cboId }: UpdateCboPayload) {
  try {
    const response = await fetchClient(`v1/empresas/cbos/${cboId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nome,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao atualizar o cbo."
      );
    }

    return (await response.json()) as ApiResponse<CboObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar o cbo.", error);
    throw error;
  }
}
