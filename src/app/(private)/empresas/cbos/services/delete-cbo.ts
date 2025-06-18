import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { CboObjectResponse } from "../interfaces/cbo-interface";

export interface DeleteCboPayload {
  cboId: string;
}

export async function deleteCbo({ cboId }: DeleteCboPayload) {
  try {
    const response = await fetchClient(`v1/empresas/cbos/${cboId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao excluir o cbo."
      );
    }

    return (await response.json()) as ApiResponse<CboObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir o cbo.", error);
    throw error;
  }
}
