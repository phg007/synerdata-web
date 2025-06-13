import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { VacationObjectResponse } from "../interfaces/vacation-interfaces";

export interface UpdateVacationPayload {
  vacationId: string;
  dataInicio: string;
  dataFim: string;
}

export async function updateVacation({
  vacationId,
  dataInicio,
  dataFim,
}: UpdateVacationPayload) {
  try {
    const response = await fetchClient(`v1/funcionarios/ferias/${vacationId}`, {
      method: "PATCH",
      body: JSON.stringify({
        dataInicio,
        dataFim,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar as férias."
      );
    }

    return (await response.json()) as ApiResponse<VacationObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar as férias:", error);
    throw error;
  }
}
