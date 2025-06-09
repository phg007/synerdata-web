import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { DepartmentObjectResponse } from "../interfaces/department-interface";

export interface UpdateDepartmentPayload {
  nome: string;
  departmentId: string;
}

export async function updateDepartment({
  nome,
  departmentId,
}: UpdateDepartmentPayload) {
  try {
    const response = await fetchClient(`v1/empresas/setores/${departmentId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nome,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao atualizar o setor."
      );
    }

    return (await response.json()) as ApiResponse<DepartmentObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar o setor.", error);
    throw error;
  }
}
