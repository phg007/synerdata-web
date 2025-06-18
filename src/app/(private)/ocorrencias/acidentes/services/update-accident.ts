import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { AcidentesObjectResponse } from "../interfaces/accident-interfaces";

export interface UpdateAccidentPayload {
  accidentId: string;
  descricao: string;
  data: string;
  natureza: string;
  cat?: string;
  medidasTomadas: string;
}

export async function updateAccident({
  accidentId,
  descricao,
  data,
  natureza,
  cat,
  medidasTomadas,
}: UpdateAccidentPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/acidentes/${accidentId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          descricao,
          data,
          natureza,
          cat,
          medidasTomadas,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar o acidente."
      );
    }

    return (await response.json()) as ApiResponse<AcidentesObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar o acidente:", error);
    throw error;
  }
}
