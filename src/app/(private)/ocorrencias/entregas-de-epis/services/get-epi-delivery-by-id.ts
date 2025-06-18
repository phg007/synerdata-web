import { fetchClient } from "@/utils/fetch-client";
import { EpiDeliveryObjectResponse } from "../interfaces/epi-delivery-interfaces";

export async function getEpiDeliveryById(
  id: string
): Promise<EpiDeliveryObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/entregas-de-epis/${id}`, {
    method: "GET",
  });

  return response.json();
}
