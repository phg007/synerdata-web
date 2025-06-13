import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { TerminationObjectResponse } from "../interfaces/termination-interfaces";

export interface UpdateTerminationPayload {
  terminationId: string;
  data: string;
  motivoInterno: string;
  motivoTrabalhista: string;
  acaoTrabalhista: string;
  formaDemissao: string;
}

export async function updateTermination({
  terminationId,
  data,
  motivoInterno,
  motivoTrabalhista,
  acaoTrabalhista,
  formaDemissao,
}: UpdateTerminationPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/demissoes/${terminationId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          data,
          motivoInterno,
          motivoTrabalhista,
          acaoTrabalhista,
          formaDemissao,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar a rescisão."
      );
    }

    return (await response.json()) as ApiResponse<TerminationObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar a rescisão:", error);
    throw error;
  }
}
