import { fetchClient } from "@/utils/fetch-client";
import { BranchObjectResponse } from "../interfaces/branch-interface";

export async function getBranchesByCompany(
  companyId: string
): Promise<BranchObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/filiais`, {
    method: "GET",
  });

  return await response.json();
}
