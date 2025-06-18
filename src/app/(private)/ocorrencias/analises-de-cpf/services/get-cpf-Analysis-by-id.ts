import { fetchClient } from "@/utils/fetch-client";
import { CpfAnalysisObjectResponse } from "../interfaces/cpf-Analysis-interfaces";

export async function getCpfAnalysisById(
  id: string
): Promise<CpfAnalysisObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/analises-de-cpf/${id}`, {
    method: "GET",
  });

  return response.json();
}
