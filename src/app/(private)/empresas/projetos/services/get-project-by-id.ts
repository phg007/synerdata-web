import { fetchClient } from "@/utils/fetch-client";
import { ProjectObjectResponse } from "../interfaces/project-interface";

export async function getProjectById(
  projectId: string
): Promise<ProjectObjectResponse> {
  const response = await fetchClient(`v1/empresas/projetos/${projectId}`, {
    method: "GET",
  });

  return await response.json();
}
