import { fetchClient } from "@/utils/fetch-client";
import { AcidentesObjectResponse } from "../interfaces/accident-interfaces";

export async function getaccidentById(
  id: string
): Promise<AcidentesObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/acidentes/${id}`, {
    method: "GET",
  });

  return await response.json();
}
