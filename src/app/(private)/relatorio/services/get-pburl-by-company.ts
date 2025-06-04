import { fetchClient } from "@/utils/fetch-client";

export interface GetPbUrlByCompanyResponse {
  succeeded: boolean;
  data: string | null;
  message: string;
}

export async function getPbUrlByCompany(companyId: string): Promise<string> {
  try {
    const response = await fetchClient(`v1/empresas/pburl/${companyId}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao obter a url do Power BI."
      );
    }

    const getPbUrlByCompanyResponse: GetPbUrlByCompanyResponse =
      await response.json();

    if (getPbUrlByCompanyResponse.data !== null)
      return getPbUrlByCompanyResponse.data;

    throw new Error("Ocorreu um erro ao obter a url do Power BI.");
  } catch (error) {
    console.error("Ocorreu um erro ao obter a url do Power BI..", error);
    throw error;
  }
}
