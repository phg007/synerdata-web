import { fetchClient } from "@/utils/fetch-client";
import { DepartmentObjectResponse } from "../interfaces/department-interface";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateDepartmentPayload {
  nome: string;
  empresaId: string;
}

export async function createDepartment({
  nome,
  empresaId,
}: CreateDepartmentPayload) {
  try {
    const response = await fetchClient(`v1/empresas/${empresaId}/setores`, {
      method: "POST",
      body: JSON.stringify({
        nome,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro criar o setor."
      );
    }

    return (await response.json()) as ApiResponse<DepartmentObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar o setor.", error);
    throw error;
  }
}
