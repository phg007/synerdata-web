import { fetchClient } from "@/utils/fetch-client";
import { acidentesObjectResponse } from "../interfaces/accident-interfaces";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateAccidentPayload {
  descricao: string;
  data: string;
  natureza: string;
  cat?: string;
  medidasTomadas: string;
  funcionarioId: string;
}

export async function createAccident({
  descricao,
  data,
  natureza,
  cat,
  medidasTomadas,
  funcionarioId,
}: CreateAccidentPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/acidentes`,
      {
        method: "POST",
        body: JSON.stringify({
          descricao,
          data,
          natureza,
          cat,
          medidasTomadas,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<acidentesObjectResponse>;

    if (!response.ok) {
      const errorMessage = responseData?.message || "Erro ao criar acidente";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar acidente:", error);
    throw error;
  }
}
