import { fetchClient } from "@/utils/fetch-client";
import { PromotionObjectResponse } from "../interfaces/promotion-interfaces";

export async function getPromotionById(
  id: string
): Promise<PromotionObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/promocoes/${id}`, {
    method: "GET",
  });

  return await response.json();
}
