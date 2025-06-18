import { fetchClient } from "@/utils/fetch-client";
import { EmployeeObjectResponse } from "../interfaces/employee-interface";

export async function getEmployeeById(
  employeeId: string
): Promise<EmployeeObjectResponse> {
  const response = await fetchClient(`v1/empresas/funcionarios/${employeeId}`, {
    method: "GET",
  });

  return await response.json();
}
