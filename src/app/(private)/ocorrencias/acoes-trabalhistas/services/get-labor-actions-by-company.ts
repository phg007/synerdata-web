import { fetchClient } from "@/utils/fetch-client";
import { LaborActionObjectResponse } from "../interfaces/labor-action";

export async function getLaborActionsByCompany(
  companyId: string
): Promise<LaborActionObjectResponse[]> {
  const response = await fetchClient(
    `v1/empresas/${companyId}/acoes-trabalhistas`,
    {
      method: "GET",
    }
  );

  return await response.json();
}
