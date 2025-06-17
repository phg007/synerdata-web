import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { CpfAnalysisObjectResponse } from "../interfaces/cpf-Analysis-interfaces";

export interface DeleteCpfAnalysisPayload {
  cpfAnalysisId: string;
}

export async function deleteCpfAnalysis({
  cpfAnalysisId,
}: DeleteCpfAnalysisPayload) {
  const response = await fetchClient(
    `v1/funcionarios/analises-de-cpf/${cpfAnalysisId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json();
    const message = data?.message || "Erro ao excluir análise de CPF";
    throw new Error(message);
  }

  return (await response.json()) as ApiResponse<CpfAnalysisObjectResponse>;
}
