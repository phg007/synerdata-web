import { fetchClient } from "@/utils/fetch-client";
import { AcidentesObjectResponse } from "../interfaces/accident-interfaces";

export async function getaccidentsByCompany(
  companyId: string
): Promise<AcidentesObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/acidentes`, {
    method: "GET",
  });

  return await response.json();
}
