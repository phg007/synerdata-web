import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { DepartmentObjectResponse } from "../interfaces/department-interface";

export interface DeleteDepartmentPayload {
  departmentId: string;
}

export async function deleteDepartment({
  departmentId,
}: DeleteDepartmentPayload) {
  try {
    const response = await fetchClient(`v1/empresas/setores/${departmentId}`, {
      method: "DELETE",
      body: JSON.stringify({
        departmentId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao excluir o setor."
      );
    }

    return (await response.json()) as ApiResponse<DepartmentObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir o setor.", error);
    throw error;
  }
}
