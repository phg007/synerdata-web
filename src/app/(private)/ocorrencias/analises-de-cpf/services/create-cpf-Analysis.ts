import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { CpfAnalysisObjectResponse } from "../interfaces/cpf-Analysis-interfaces";

export interface CreateCpfAnalysisPayload {
  funcionarioId: string;
  descricao: string;
}

export async function createCpfAnalysis({
  funcionarioId,
  descricao,
}: CreateCpfAnalysisPayload) {
  const response = await fetchClient(
    `v1/funcionarios/${funcionarioId}/analises-de-cpf`,
    {
      method: "POST",
      body: JSON.stringify({ descricao }),
    }
  );

  const data =
    (await response.json()) as ApiResponse<CpfAnalysisObjectResponse>;

  if (!response.ok) {
    const message = data?.message || "Erro ao criar análise de CPF";
    throw new Error(message);
  }

  return data;
}
