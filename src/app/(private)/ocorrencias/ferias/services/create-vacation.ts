import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { VacationObjectResponse } from "../interfaces/vacation-interfaces";

export interface CreateVacationPayload {
  dataInicio: string;
  dataFim: string;
  funcionarioId: string;
}

export async function createVacation({
  dataInicio,
  dataFim,
  funcionarioId,
}: CreateVacationPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/ferias`,
      {
        method: "POST",
        body: JSON.stringify({
          dataInicio,
          dataFim,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<VacationObjectResponse>;

    if (!response.ok) {
      const errorMessage = responseData?.message || "Erro ao criar férias";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar férias:", error);
    throw error;
  }
}
