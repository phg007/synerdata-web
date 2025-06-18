import { fetchClient } from "@/utils/fetch-client";
import { CompanyObjectResponse } from "../interfaces/company-interface";

export async function getCompanyById(
  companyId: string
): Promise<CompanyObjectResponse> {
  const response = await fetchClient(`v1/empresas/${companyId}`, {
    method: "GET",
  });

  return await response.json();
}
