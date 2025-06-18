import { fetchClient } from "@/utils/fetch-client";
import { DepartmentObjectResponse } from "../interfaces/department-interface";

export async function getDepartmentById(
  departmentId: string
): Promise<DepartmentObjectResponse> {
  const response = await fetchClient(`v1/empresas/setores/${departmentId}`, {
    method: "GET",
  });

  return await response.json();
}
