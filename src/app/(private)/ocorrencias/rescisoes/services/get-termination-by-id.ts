import { fetchClient } from "@/utils/fetch-client";
import { TerminationObjectResponse } from "../interfaces/termination-interfaces";

export async function getTerminationById(
  id: string
): Promise<TerminationObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/demissoes/${id}`, {
    method: "GET",
  });

  return await response.json();
}
