import { fetchClient } from "@/utils/fetch-client";
import { EPI } from "./epi-interfaces";

export async function getEPIs(companyId: string): Promise<EPI[]> {
  const response = await fetchClient(`v1/usuarios/empresa/${companyId}`, {
    method: "GET",
  });

  return await response.json();
}
