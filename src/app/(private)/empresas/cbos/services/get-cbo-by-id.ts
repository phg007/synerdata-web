import { fetchClient } from "@/utils/fetch-client";
import { CboObjectResponse } from "../interfaces/cbo-interface";

export async function getCboById(cboId: string): Promise<CboObjectResponse> {
  const response = await fetchClient(`v1/empresas/cbos/${cboId}`, {
    method: "GET",
  });

  return await response.json();
}
