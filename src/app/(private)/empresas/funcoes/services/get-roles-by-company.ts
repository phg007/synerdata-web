import { fetchClient } from "@/utils/fetch-client";
import { RoleObjectResponse } from "../interfaces/role-interface";

export async function getRolesByCompany(
  companyId: string
): Promise<RoleObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/funcoes`, {
    method: "GET",
  });

  return await response.json();
}
