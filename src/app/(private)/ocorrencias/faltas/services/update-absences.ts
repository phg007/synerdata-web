import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { AbsencesObjectResponse } from "../interfaces/absences-interfaces";

export interface UpdateAbsencePayload {
  absenceId: string;
  data: string;
  motivo: string;
}

export async function updateAbsence({
  absenceId,
  data,
  motivo,
}: UpdateAbsencePayload) {
  try {
    const response = await fetchClient(`v1/funcionarios/faltas/${absenceId}`, {
      method: "PATCH",
      body: JSON.stringify({
        data,
        motivo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar a falta."
      );
    }

    return (await response.json()) as ApiResponse<AbsencesObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar a falta:", error);
    throw error;
  }
}
