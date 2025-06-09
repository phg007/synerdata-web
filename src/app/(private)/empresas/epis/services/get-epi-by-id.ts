import { fetchClient } from "@/utils/fetch-client";
import { GetEpiResponseData } from "./epi-interfaces";

export async function getEPIById(id: string): Promise<GetEpiResponseData> {
  const response = await fetchClient(`v1/empresas/epis/${id}`, {
    method: "GET",
  });
  const data: GetEpiResponseData = await response.json();

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }

  return data;
}
