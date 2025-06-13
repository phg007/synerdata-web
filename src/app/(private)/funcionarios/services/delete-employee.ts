import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { EmployeeObjectResponse } from "../interfaces/employee-interface";

export interface DeleteEmployeePayload {
  employeeId: string;
}

export async function deleteEmployee({ employeeId }: DeleteEmployeePayload) {
  try {
    const response = await fetchClient(
      `v1/empresas/funcionarios/${employeeId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao excluir o setor."
      );
    }

    return (await response.json()) as ApiResponse<EmployeeObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir o setor.", error);
    throw error;
  }
}
