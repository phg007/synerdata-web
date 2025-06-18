import { fetchClient } from "@/utils/fetch-client";
import { EmployeeObjectResponse } from "../interfaces/employee-interface";

export async function getEmployeesByCompany(
  companyId: string
): Promise<EmployeeObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/funcionarios`, {
    method: "GET",
  });

  return await response.json();
}
