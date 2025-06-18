import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { EpiDeliveryObjectResponse } from "../interfaces/epi-delivery-interfaces";

export interface UpdateEpiDeliveryPayload {
  epiDeliveryId: string;
  data: string;
  epis: string[];
  motivo: string;
  entreguePor: string;
}

export async function updateEpiDelivery({
  epiDeliveryId,
  data,
  epis,
  motivo,
  entreguePor,
}: UpdateEpiDeliveryPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/entregas-de-epis/${epiDeliveryId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ data, epis, motivo, entreguePor }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar a entrega de EPI."
      );
    }

    return (await response.json()) as ApiResponse<EpiDeliveryObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar a entrega de EPI:", error);
    throw error;
  }
}
