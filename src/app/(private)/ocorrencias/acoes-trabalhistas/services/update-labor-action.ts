import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { LaborActionObjectResponse } from "../interfaces/labor-action";

export interface UpdateLaborActionPayload {
  laborActionId: string;
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

export async function updateLaborAction({
  laborActionId,
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
}: UpdateLaborActionPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/acoes-trabalhistas/${laborActionId}`,
      {
        method: "PATCH",
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar a ação trabalhista."
      );
    }

    return (await response.json()) as ApiResponse<LaborActionObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar a ação trabalhista:", error);
    throw error;
  }
}
