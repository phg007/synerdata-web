import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { PromotionObjectResponse } from "../interfaces/promotion-interfaces";

export interface UpdatePromotionPayload {
  promotionId: string;
  data: string;
  funcaoId: string;
  salario: number;
}

export async function updatePromotion({
  promotionId,
  data,
  funcaoId,
  salario,
}: UpdatePromotionPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/promocoes/${promotionId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          data,
          funcaoId,
          salario,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar a promoção."
      );
    }

    return (await response.json()) as ApiResponse<PromotionObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar a promoção:", error);
    throw error;
  }
}
