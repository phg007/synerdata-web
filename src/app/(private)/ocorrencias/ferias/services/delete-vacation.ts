import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { VacationObjectResponse } from "../interfaces/vacation-interfaces";

export interface DeleteVacationPayload {
  vacationId: string;
}

export async function deleteVacation({ vacationId }: DeleteVacationPayload) {
  try {
    const response = await fetchClient(`v1/funcionarios/ferias/${vacationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir as férias."
      );
    }

    return (await response.json()) as ApiResponse<VacationObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir as férias:", error);
    throw error;
  }
}
