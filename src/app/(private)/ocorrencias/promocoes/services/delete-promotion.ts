import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { PromotionObjectResponse } from "../interfaces/promotion-interfaces";

export interface DeletePromotionPayload {
  promotionId: string;
}

export async function deletePromotion({ promotionId }: DeletePromotionPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/promocoes/${promotionId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir a promoção."
      );
    }

    return (await response.json()) as ApiResponse<PromotionObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir a promoção:", error);
    throw error;
  }
}
