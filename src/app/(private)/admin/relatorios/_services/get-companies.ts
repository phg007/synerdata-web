import { CompanyObjectResponse } from "@/app/(private)/empresas/interfaces/company-interface";
import { fetchClient } from "@/utils/fetch-client";

export async function getCompanies(): Promise<CompanyObjectResponse[]> {
  const response = await fetchClient("v1/empresas", {
    method: "GET",
  });

  return await response.json();
}
