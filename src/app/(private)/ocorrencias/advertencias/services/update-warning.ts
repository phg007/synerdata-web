import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { WarningObjectResponse } from "../interfaces/warning-interface";

export interface UpdateWarningPayload {
  warningId: string;
  data: string;
  motivo: string;
}

export async function updateWarning({
  warningId,
  data,
  motivo,
}: UpdateWarningPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/advertencias/${warningId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          data,
          motivo,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar a advertência."
      );
    }

    return (await response.json()) as ApiResponse<WarningObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar a advertência:", error);
    throw error;
  }
}
