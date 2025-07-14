import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { WarningObjectResponse } from "../interfaces/warning-interface";

export interface DeleteWarningPayload {
  warningId: string;
}

export async function deleteWarning({ warningId }: DeleteWarningPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/advertencias/${warningId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir a advertência."
      );
    }

    return (await response.json()) as ApiResponse<WarningObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir a advertência:", error);
    throw error;
  }
}
