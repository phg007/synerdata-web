import { fetchClient } from "@/utils/fetch-client";
import { CpfAnalysisObjectResponse } from "../interfaces/cpf-Analysis-interfaces";

export async function getCpfAnalysesByCompany(
  companyId: string
): Promise<CpfAnalysisObjectResponse[]> {
  const response = await fetchClient(
    `v1/empresas/${companyId}/analises-de-cpf`,
    {
      method: "GET",
    }
  );

  return response.json();
}
