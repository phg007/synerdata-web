import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { EpiObjectResponse } from "../interfaces/epi-interfaces";

export interface DeleteEpiPayload {
  epiId: string;
}

export async function deleteEPI({ epiId }: DeleteEpiPayload) {
  try {
    const response = await fetchClient(`v1/empresas/epis/${epiId}`, {
      method: "DELETE",
      body: JSON.stringify({
        epiId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao excluir o Epi."
      );
    }

    return (await response.json()) as ApiResponse<EpiObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir a filial.", error);
    throw error;
  }
}
