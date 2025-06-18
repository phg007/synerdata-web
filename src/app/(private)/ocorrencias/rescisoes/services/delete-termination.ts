import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { TerminationObjectResponse } from "../interfaces/termination-interfaces";

export interface DeleteTerminationPayload {
  terminationId: string;
}

export async function deleteTermination({
  terminationId,
}: DeleteTerminationPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/demissoes/${terminationId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir a rescisão."
      );
    }

    return (await response.json()) as ApiResponse<TerminationObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir a rescisão:", error);
    throw error;
  }
}
