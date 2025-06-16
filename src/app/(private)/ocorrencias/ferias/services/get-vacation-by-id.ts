import { fetchClient } from "@/utils/fetch-client";
import { VacationObjectResponse } from "../interfaces/vacation-interfaces";

export async function getVacationById(
  id: string
): Promise<VacationObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/ferias/${id}`, {
    method: "GET",
  });

  return await response.json();
}
