import { fetchClient } from "@/utils/fetch-client";
import { EpiDeliveryObjectResponse } from "../interfaces/epi-delivery-interfaces";

export async function getEpiDeliveriesByCompany(
  companyId: string
): Promise<EpiDeliveryObjectResponse[]> {
  const response = await fetchClient(
    `v1/empresas/${companyId}/entregas-de-epis`,
    {
      method: "GET",
    }
  );

  return response.json();
}
