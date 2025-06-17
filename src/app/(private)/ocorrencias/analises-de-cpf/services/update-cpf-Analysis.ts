import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { CpfAnalysisObjectResponse } from "../interfaces/cpf-Analysis-interfaces";

export interface UpdateCpfAnalysisPayload {
  cpfAnalysisId: string;
  descricao: string;
}

export async function updateCpfAnalysis({
  cpfAnalysisId,
  descricao,
}: UpdateCpfAnalysisPayload) {
  const response = await fetchClient(
    `v1/funcionarios/analises-de-cpf/${cpfAnalysisId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ descricao }),
    }
  );

  const data =
    (await response.json()) as ApiResponse<CpfAnalysisObjectResponse>;

  if (!response.ok) {
    const message = data?.message || "Erro ao atualizar análise de CPF";
    throw new Error(message);
  }

  return data;
}
