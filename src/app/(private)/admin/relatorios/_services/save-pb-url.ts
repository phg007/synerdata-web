import { CompanyObjectResponse } from "@/app/(private)/empresas/interfaces/company-interface";
import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface UpdatePbUrlPayload {
  pbUrl: string;
  empresaId: string;
}

export async function updatePbUrl({ pbUrl, empresaId }: UpdatePbUrlPayload) {
  try {
    const response = await fetchClient(`v1/empresas/${empresaId}/pburl`, {
      method: "PATCH",
      body: JSON.stringify({
        pbUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro atualizar a url do PowerBI."
      );
    }

    return (await response.json()) as ApiResponse<CompanyObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro atualizar a url do PowerBI.", error);
    throw error;
  }
}
