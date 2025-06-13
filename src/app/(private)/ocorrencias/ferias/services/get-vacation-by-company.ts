import { fetchClient } from "@/utils/fetch-client";
import { VacationObjectResponse } from "../interfaces/vacation-interfaces";

export async function getVacationsByCompany(
  companyId: string
): Promise<VacationObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/ferias`, {
    method: "GET",
  });

  return await response.json();
}
