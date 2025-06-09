import { fetchClient } from "@/utils/fetch-client";
import { CostCenterObjectResponse } from "../interfaces/cost-center-interface";

export async function getCostCentersByCompany(
  companyId: string
): Promise<CostCenterObjectResponse[]> {
  const response = await fetchClient(
    `v1/empresas/${companyId}/centros-de-custo`,
    {
      method: "GET",
    }
  );

  return await response.json();
}
