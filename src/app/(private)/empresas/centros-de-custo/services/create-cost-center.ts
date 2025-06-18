import { fetchClient } from "@/utils/fetch-client";
import { CostCenterObjectResponse } from "../interfaces/cost-center-interface";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateCostCenterPayload {
  nome: string;
  empresaId: string;
}

export async function createCostCenter({
  nome,
  empresaId,
}: CreateCostCenterPayload) {
  try {
    const response = await fetchClient(
      `v1/empresas/${empresaId}/centros-de-custo`,
      {
        method: "POST",
        body: JSON.stringify({
          nome,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro criar o centro de custo."
      );
    }

    return (await response.json()) as ApiResponse<CostCenterObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar o centro de custo.", error);
    throw error;
  }
}
