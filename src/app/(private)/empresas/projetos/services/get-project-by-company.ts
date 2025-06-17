import { fetchClient } from "@/utils/fetch-client";
import { ProjectObjectResponse } from "../interfaces/project-interface";

export async function getProjectsByCompany(
  companyId: string
): Promise<ProjectObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/projetos`, {
    method: "GET",
  });

  return await response.json();
}
