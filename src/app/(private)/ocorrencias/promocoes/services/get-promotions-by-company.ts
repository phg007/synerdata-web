import { fetchClient } from "@/utils/fetch-client";
import { PromotionObjectResponse } from "../interfaces/promotion-interfaces";

export async function getPromotionsByCompany(
  companyId: string
): Promise<PromotionObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/promocoes`, {
    method: "GET",
  });

  return await response.json();
}
