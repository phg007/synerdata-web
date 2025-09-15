import { CompanyObjectResponse } from "@/app/(private)/empresas/interfaces/company-interface";
import { fetchClient } from "@/utils/fetch-client";

export interface CompanyWithStatsObjectResponse extends CompanyObjectResponse {
  quantidadeUsuarios: number;
  statusAssinatura: string;
}

export async function getCompaniesWithStats(): Promise<
  CompanyWithStatsObjectResponse[]
> {
  const response = await fetchClient("v1/empresas/estatisticas", {
    method: "GET",
  });

  return await response.json();
}
