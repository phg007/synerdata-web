import { fetchClient } from "@/utils/fetch-client";

import { GetEpiResponseData, EpiApiResponse } from "./epi-interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createEPI(
  epiData: GetEpiResponseData,
  empresa: string
): Promise<EpiApiResponse> {
  const response = await fetchClient(
    `${API_BASE_URL}/v1/empresas/${empresa}/epis`,
    {
      method: "POST",

      body: JSON.stringify(epiData),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.message || "Erro ao criar setor";

    throw new Error(errorMessage);
  }

  return data;
}
