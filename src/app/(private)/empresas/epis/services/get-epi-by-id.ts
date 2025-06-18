import { fetchClient } from "@/utils/fetch-client";
import { EpiObjectResponse } from "../interfaces/epi-interfaces";

export async function getEPIById(id: string): Promise<EpiObjectResponse> {
  const response = await fetchClient(`v1/empresas/epis/${id}`, {
    method: "GET",
  });

  return await response.json();
}
