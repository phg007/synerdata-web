import { fetchClient } from "@/utils/fetch-client";
import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface RoleObjectResponse extends BaseObjectResponse {
  nome: string;
  epis: string[];
}

export async function getRolesByCompany(
  companyId: string
): Promise<RoleObjectResponse[]> {
  try {
    const response = await fetchClient(`v1/empresas/${companyId}/funcoes`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Erro ao buscar funções");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro em getRolesByCompany:", error);
    throw error;
  }
}
