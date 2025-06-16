import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { EpiDeliveryObjectResponse } from "../interfaces/epi-delivery-interfaces";

export interface DeleteEpiDeliveryPayload {
  epiDeliveryId: string;
}

export async function deleteEpiDelivery({
  epiDeliveryId,
}: DeleteEpiDeliveryPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/entregas-de-epis/${epiDeliveryId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir a entrega de EPI."
      );
    }

    return (await response.json()) as ApiResponse<EpiDeliveryObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir a entrega de EPI:", error);
    throw error;
  }
}
