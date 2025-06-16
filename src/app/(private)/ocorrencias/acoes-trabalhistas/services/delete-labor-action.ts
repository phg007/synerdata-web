import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { LaborActionObjectResponse } from "../interfaces/labor-action";

export interface DeleteLaborActionPayload {
  laborActionId: string;
}

export async function deleteLaborAction({ laborActionId }: DeleteLaborActionPayload) {
  try {
    const response = await fetchClient(`v1/funcionarios/acoes-trabalhistas/${laborActionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir a ação trabalhista."
      );
    }

    return (await response.json()) as ApiResponse<LaborActionObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir a ação trabalhista:", error);
    throw error;
  }
}
