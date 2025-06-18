import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { LaborActionObjectResponse } from "../interfaces/labor-action";

export interface CreateLaborActionPayload {
  funcionarioId: string;
  numeroProcesso: string;
  tribunal: string;
  dataAjuizamento: string;
  reclamante: string;
  reclamado: string;
  advogadoReclamante?: string;
  advogadoReclamado?: string;
  descricao: string;
  valorCausa?: number;
  andamento?: string;
  decisao?: string;
  dataConclusao?: string;
  recursos?: string;
  custasDespesas?: number;
  dataConhecimento: string;
}

export async function createLaborAction({
  funcionarioId,
  numeroProcesso,
  tribunal,
  dataAjuizamento,
  reclamante,
  reclamado,
  advogadoReclamante,
  advogadoReclamado,
  descricao,
  valorCausa,
  andamento,
  decisao,
  dataConclusao,
  recursos,
  custasDespesas,
  dataConhecimento,
}: CreateLaborActionPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/acoes-trabalhistas`,
      {
        method: "POST",
        body: JSON.stringify({
          numeroProcesso,
          tribunal,
          dataAjuizamento,
          reclamante,
          reclamado,
          advogadoReclamante,
          advogadoReclamado,
          descricao,
          valorCausa,
          andamento,
          decisao,
          dataConclusao,
          recursos,
          custasDespesas,
          dataConhecimento,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<LaborActionObjectResponse>;

    if (!response.ok) {
      const errorMessage =
        responseData?.message || "Erro ao criar ação trabalhista";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar ação trabalhista:", error);
    throw error;
  }
}
