import { fetchClient } from "@/utils/fetch-client";
import { GetEpiResponseData } from "./epi-interfaces";

export async function getEPIs(
  companyId: string
): Promise<GetEpiResponseData[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/epis`, {
    method: "GET",
  });

  return await response.json();
}
