import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { PromotionObjectResponse } from "../interfaces/promotion-interfaces";

export interface CreatePromotionPayload {
  data: string;
  funcaoId: string;
  salario: number;
  funcionarioId: string;
}

export async function createPromotion({
  data,
  funcaoId,
  salario,
  funcionarioId,
}: CreatePromotionPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/promocoes`,
      {
        method: "POST",
        body: JSON.stringify({
          data,
          funcaoId,
          salario,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<PromotionObjectResponse>;

    if (!response.ok) {
      const errorMessage = responseData?.message || "Erro ao criar promoção";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar promoção:", error);
    throw error;
  }
}
