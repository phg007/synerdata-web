import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { EpiObjectResponse } from "../interfaces/epi-interfaces";

export interface EpiPlayload {
  nome: string;
  descricao: string;
  equipamentos: string;
  epiId: string;
}

export async function updateEPI({
  nome,
  descricao,
  equipamentos,
  epiId,
}: EpiPlayload) {
  try {
    const response = await fetchClient(`v1/empresas/epis/${epiId}`, {
      method: "PATCH",

      body: JSON.stringify({ nome, descricao, equipamentos }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao atualizar a epi."
      );
    }
    return (await response.json()) as ApiResponse<EpiObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro em alterar o Epi .", error);
    throw error;
  }
}
