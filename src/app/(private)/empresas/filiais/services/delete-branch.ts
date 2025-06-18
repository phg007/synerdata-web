import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { BranchObjectResponse } from "../interfaces/branch-interface";

export interface DeleteBranchPayload {
  branchId: string;
}

export async function deleteBranch({ branchId }: DeleteBranchPayload) {
  try {
    const response = await fetchClient(`v1/empresas/filiais/${branchId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao excluir a filial."
      );
    }

    return (await response.json()) as ApiResponse<BranchObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir a filial.", error);
    throw error;
  }
}
