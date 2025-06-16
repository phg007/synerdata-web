import { fetchClient } from "@/utils/fetch-client";
import { TerminationObjectResponse } from "../interfaces/termination-interfaces";

export async function getTerminationsByCompany(
  companyId: string
): Promise<TerminationObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/demissoes`, {
    method: "GET",
  });

  return await response.json();
}
