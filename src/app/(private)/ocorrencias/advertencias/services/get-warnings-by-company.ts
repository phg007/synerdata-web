import { fetchClient } from "@/utils/fetch-client";
import { WarningObjectResponse } from "../interfaces/warning-interface";

export async function getWarningsByCompany(
  companyId: string
): Promise<WarningObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/advertencias`, {
    method: "GET",
  });

  return await response.json();
}
