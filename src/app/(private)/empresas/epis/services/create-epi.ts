import { fetchClient } from "@/utils/fetch-client";

import { EpiObjectResponse } from "../interfaces/epi-interfaces";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface EpiPlayload {
  nome: string;
  descricao: string;
  equipamentos: string;
  empresaId: string;
}

export async function createEPI({
  nome,
  descricao,
  equipamentos,
  empresaId,
}: EpiPlayload) {
  try {
    const response = await fetchClient(`v1/empresas/${empresaId}/epis`, {
      method: "POST",

      body: JSON.stringify({ nome, descricao, equipamentos }),
    });

    const data = (await response.json()) as ApiResponse<EpiObjectResponse>;
    if (!response.ok) {
      const errorMessage = data?.message || "Erro ao criar setor";

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Ocorreu um erro ao criar o Epi.", error);
    throw error;
  }
}
