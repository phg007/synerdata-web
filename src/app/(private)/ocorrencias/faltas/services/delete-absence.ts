import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { AbsencesObjectResponse } from "../interfaces/absence-interfaces";

export interface DeleteAbsencePayload {
  absenceId: string;
}

export async function deleteAbsence({ absenceId }: DeleteAbsencePayload) {
  try {
    const response = await fetchClient(`v1/funcionarios/faltas/${absenceId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir a falta."
      );
    }

    return (await response.json()) as ApiResponse<AbsencesObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir a falta:", error);
    throw error;
  }
}
