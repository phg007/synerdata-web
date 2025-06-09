import { fetchClient } from "@/utils/fetch-client";
import { DepartmentObjectResponse } from "../interfaces/department-interface";

export async function getDepartmentsByCompany(
  companyId: string
): Promise<DepartmentObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/setores`, {
    method: "GET",
  });

  return await response.json();
}
