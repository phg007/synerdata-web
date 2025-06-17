import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { ProjectObjectResponse } from "../interfaces/project-interface";

export interface UpdateProjectPayload {
  projectId: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  cno: string;
}

export async function updateProject({
  projectId,
  nome,
  descricao,
  dataInicio,
  cno,
}: UpdateProjectPayload) {
  try {
    const response = await fetchClient(`v1/empresas/projetos/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nome,
        descricao,
        dataInicio,
        cno,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error?.message || "Ocorreu um erro ao atualizar o projeto."
      );
    }

    return (await response.json()) as ApiResponse<ProjectObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar o projeto.", error);
    throw error;
  }
}
