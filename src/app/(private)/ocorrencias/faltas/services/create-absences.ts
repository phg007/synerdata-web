import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { AbsencesObjectResponse } from "../interfaces/absences-interfaces";

export interface CreateAbsencePayload {
  data: string;
  motivo: string;
  funcionarioId: string;
}

export async function createAbsence({
  data,
  motivo,
  funcionarioId,
}: CreateAbsencePayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/faltas`,
      {
        method: "POST",
        body: JSON.stringify({
          data,
          motivo,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<AbsencesObjectResponse>;

    if (!response.ok) {
      const errorMessage = responseData?.message || "Erro ao criar falta";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar falta:", error);
    throw error;
  }
}
