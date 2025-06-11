import { fetchClient } from "@/utils/fetch-client";
import { acidentesObjectResponse } from "../interfaces/accidents-interfaces";

export async function getaccidentById(
  id: string
): Promise<acidentesObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/acidentes/${id}`, {
    method: "GET",
  });

  return await response.json();
}
