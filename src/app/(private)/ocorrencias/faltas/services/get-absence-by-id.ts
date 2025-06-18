import { fetchClient } from "@/utils/fetch-client";
import { AbsencesObjectResponse } from "../interfaces/absence-interfaces";

export async function getAbsenceById(
  id: string
): Promise<AbsencesObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/faltas/${id}`, {
    method: "GET",
  });

  return await response.json();
}
