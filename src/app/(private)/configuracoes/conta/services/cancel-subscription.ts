import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CancelSubscriptionPayload {
  companyId: string;
}

export async function cancelSubscription({
  companyId,
}: CancelSubscriptionPayload) {
  try {
    const response = await fetchClient(
      `v1/payments/subscriptions/${companyId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao cancelar a assinatura."
      );
    }

    return (await response.json()) as ApiResponse<null>;
  } catch (error) {
    console.error("Erro ao cancelar a assinatura:", error);
    throw error;
  }
}
