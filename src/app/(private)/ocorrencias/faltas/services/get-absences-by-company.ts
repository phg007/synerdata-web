import { fetchClient } from "@/utils/fetch-client";
import { AbsencesObjectResponse } from "../interfaces/absences-interfaces";

export async function getAbsencesByCompany(
  companyId: string
): Promise<AbsencesObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/faltas`, {
    method: "GET",
  });

  return await response.json();
}
