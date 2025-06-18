import { SubscriptionDataResponse } from "@/app/(private)/empresas/interfaces/subscription-interface";
import { fetchClient } from "@/utils/fetch-client";

export async function getSubscriptionData(
  subscriptionId: string
): Promise<SubscriptionDataResponse> {
  const response = await fetchClient(
    `payments/subscriptions/${subscriptionId}`,
    {
      method: "GET",
    }
  );

  return await response.json();
}
