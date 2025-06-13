import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { RoleObjectResponse } from "../interfaces/role-interface";

export interface DeleteRolePayload {
  roleId: string;
}

export async function deleteRole({ roleId }: DeleteRolePayload) {
  try {
    const response = await fetchClient(`v1/empresas/funcoes/${roleId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao excluir a função."
      );
    }

    return (await response.json()) as ApiResponse<RoleObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir a função.", error);
    throw error;
  }
}
