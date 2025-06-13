import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { RoleObjectResponse } from "../interfaces/role-interface";

export interface UpdateRolePayload {
  nome: string;
  epis?: string[];
  roleId: string;
}

export async function updateRole({ nome, epis, roleId }: UpdateRolePayload) {
  try {
    const response = await fetchClient(`v1/empresas/funcoes/${roleId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nome,
        epis,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao atualizar a função."
      );
    }

    return (await response.json()) as ApiResponse<RoleObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar a função.", error);
    throw error;
  }
}
