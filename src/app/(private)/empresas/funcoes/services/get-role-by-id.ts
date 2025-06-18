import { fetchClient } from "@/utils/fetch-client";
import { RoleObjectResponse } from "../interfaces/role-interface";

export async function getRoleById(roleId: string): Promise<RoleObjectResponse> {
  const response = await fetchClient(`v1/empresas/funcoes/${roleId}`, {
    method: "GET",
  });

  return await response.json();
}
