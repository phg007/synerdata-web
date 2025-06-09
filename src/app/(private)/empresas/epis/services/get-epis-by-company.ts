import { fetchClient } from "@/utils/fetch-client";
import { EpiObjectResponse } from "../interfaces/epi-interfaces";

export async function getEPIsByCompany(
  companyId: string
): Promise<EpiObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/epis`, {
    method: "GET",
  });

  return await response.json();
}
