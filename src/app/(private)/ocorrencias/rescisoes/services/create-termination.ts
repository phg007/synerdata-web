import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { TerminationObjectResponse } from "../interfaces/termination-interfaces";

export interface CreateTerminationPayload {
  data: string;
  motivoInterno: string;
  motivoTrabalhista: string;
  acaoTrabalhista: string;
  formaDemissao: string;
  funcionarioId: string;
}

export async function createTermination({
  data,
  motivoInterno,
  motivoTrabalhista,
  acaoTrabalhista,
  formaDemissao,
  funcionarioId,
}: CreateTerminationPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/demissoes`,
      {
        method: "POST",
        body: JSON.stringify({
          data,
          motivoInterno,
          motivoTrabalhista,
          acaoTrabalhista,
          formaDemissao,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<TerminationObjectResponse>;

    if (!response.ok) {
      const errorMessage = responseData?.message || "Erro ao criar rescisão";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar rescisão:", error);
    throw error;
  }
}
