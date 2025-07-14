import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { WarningObjectResponse } from "../interfaces/warning-interface";

export interface CreateWarningPayload {
  data: string;
  motivo: string;
  funcionarioId: string;
}

export async function createWarning({
  data,
  motivo,
  funcionarioId,
}: CreateWarningPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/advertencias`,
      {
        method: "POST",
        body: JSON.stringify({
          data,
          motivo,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<WarningObjectResponse>;

    if (!response.ok) {
      const errorMessage = responseData?.message || "Erro ao criar advertência";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar advertência:", error);
    throw error;
  }
}
