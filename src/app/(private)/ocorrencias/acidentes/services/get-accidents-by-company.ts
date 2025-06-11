import { fetchClient } from "@/utils/fetch-client";
import { acidentesObjectResponse } from "../interfaces/accidents-interfaces";

export async function getaccidentsByCompany(
  companyId: string
): Promise<acidentesObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/acidentes`, {
    method: "GET",
  });

  return await response.json();
}
