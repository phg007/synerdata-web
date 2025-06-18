import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { ProjectObjectResponse } from "../interfaces/project-interface";

export interface DeleteProjectPayload {
  projectId: string;
}

export async function deleteProject({ projectId }: DeleteProjectPayload) {
  try {
    const response = await fetchClient(`v1/empresas/projetos/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error?.message || "Ocorreu um erro ao excluir o projeto."
      );
    }

    return (await response.json()) as ApiResponse<ProjectObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao excluir o projeto.", error);
    throw error;
  }
}
