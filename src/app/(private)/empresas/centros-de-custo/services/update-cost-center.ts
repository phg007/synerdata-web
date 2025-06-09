import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { CostCenterObjectResponse } from "../interfaces/cost-center-interface";

export interface UpdateCostCenterPayload {
  nome: string;
  costCenterId: string;
}

export async function updateCostCenter({
  nome,
  costCenterId,
}: UpdateCostCenterPayload) {
  try {
    const response = await fetchClient(
      `v1/empresas/centros-de-custo/${costCenterId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          nome,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message ||
          "Ocorreu um erro ao atualizar o centro de custo."
      );
    }

    return (await response.json()) as ApiResponse<CostCenterObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar o centro de custo.", error);
    throw error;
  }
}
