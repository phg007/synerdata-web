import { fetchClient } from "@/utils/fetch-client";
import { GetEpiResponseData, EpiApiResponse } from "./epi-interfaces";

export async function updateEPI(
  epiPayload: GetEpiResponseData
): Promise<EpiApiResponse> {
  try {
    const response = await fetchClient(`v1/empresas/epis/${epiPayload.id}`, {
      method: "PATCH",

      body: JSON.stringify(epiPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || `Erro ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Ocorreu um erro em alterar o Epi .", error);
    throw error;
  }
}
