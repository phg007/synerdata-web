import { fetchClient } from "@/utils/fetch-client";
import { CostCenterObjectResponse } from "../interfaces/cost-center-interface";

export async function getCostCenterById(
  costcenterId: string
): Promise<CostCenterObjectResponse> {
  const response = await fetchClient(
    `v1/empresas/centros-de-custo/${costcenterId}`,
    {
      method: "GET",
    }
  );

  return await response.json();
}
