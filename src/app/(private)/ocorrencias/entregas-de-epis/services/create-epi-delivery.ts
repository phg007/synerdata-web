import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { EpiDeliveryObjectResponse } from "../interfaces/epi-delivery-interfaces";

export interface CreateEpiDeliveryPayload {
  data: string;
  epis: string[];
  motivo: string;
  entreguePor: string;
  funcionarioId: string;
}

export async function createEpiDelivery({
  data,
  epis,
  motivo,
  entreguePor,
  funcionarioId,
}: CreateEpiDeliveryPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/entregas-de-epis`,
      {
        method: "POST",
        body: JSON.stringify({
          data,
          epis,
          motivo,
          entreguePor,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<EpiDeliveryObjectResponse>;

    if (!response.ok) {
      const errorMessage =
        responseData?.message || "Erro ao registrar entrega de EPI";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao registrar entrega de EPI:", error);
    throw error;
  }
}
