import { fetchClient } from "@/utils/fetch-client";
import { LaborActionObjectResponse } from "../interfaces/labor-action";

export async function getLaborActionById(
  id: string
): Promise<LaborActionObjectResponse> {
  const response = await fetchClient(
    `v1/funcionarios/acoes-trabalhistas/${id}`,
    {
      method: "GET",
    }
  );

  return await response.json();
}
