import { fetchClient } from "@/utils/fetch-client";
import { RoleObjectResponse } from "../interfaces/role-interface";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateRolePayload {
  nome: string;
  epis?: string[];
  empresaId: string;
}

export async function createRole({ nome, epis, empresaId }: CreateRolePayload) {
  try {
    const response = await fetchClient(`v1/empresas/${empresaId}/funcoes`, {
      method: "POST",
      body: JSON.stringify({
        nome,
        epis,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro criar a função."
      );
    }

    return (await response.json()) as ApiResponse<RoleObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar a função.", error);
    throw error;
  }
}
