import { fetchClient } from "@/utils/fetch-client";

export interface GetPbUrlByCompanyResponse {
  succeeded: boolean;
  data: string | null;
  message: string;
}

export async function getPbUrlByCompany(
  companyId: string
): Promise<string | null> {
  try {
    const response = await fetchClient(`v1/empresas/pburl/${companyId}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (errorData.error.message === "A empresa não possui URL do Power BI.") {
        return null;
      }

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao obter a URL do Power BI."
      );
    }

    const getPbUrlByCompanyResponse: GetPbUrlByCompanyResponse =
      await response.json();

    return getPbUrlByCompanyResponse.data;
  } catch (error) {
    console.error("Erro ao obter a URL do Power BI:", error);
    throw error;
  }
}
