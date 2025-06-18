import { fetchClient } from "@/utils/fetch-client";
import { CboObjectResponse } from "../interfaces/cbo-interface";

export async function getCbosByCompany(
  companyId: string
): Promise<CboObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/cbos`, {
    method: "GET",
  });

  return await response.json();
}
