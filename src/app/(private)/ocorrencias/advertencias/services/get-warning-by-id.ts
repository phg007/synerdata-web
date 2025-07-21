import { fetchClient } from "@/utils/fetch-client";
import { WarningObjectResponse } from "../interfaces/warning-interface";

export async function getWarningById(
  id: string
): Promise<WarningObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/advertencias/${id}`, {
    method: "GET",
  });

  return await response.json();
}
