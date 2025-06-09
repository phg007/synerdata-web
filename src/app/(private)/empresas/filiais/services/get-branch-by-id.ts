import { fetchClient } from "@/utils/fetch-client";
import { BranchObjectResponse } from "../interfaces/branch-interface";

export async function getBranchById(
  branchId: string
): Promise<BranchObjectResponse> {
  const response = await fetchClient(`v1/empresas/filiais/${branchId}`, {
    method: "GET",
  });

  return await response.json();
}
