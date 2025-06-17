import { fetchClient } from "@/utils/fetch-client";
import { ProjectObjectResponse } from "../interfaces/project-interface";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateProjectPayload {
  nome: string;
  descricao: string;
  dataInicio: string;
  cno: string;
  empresaId: string;
}

export async function createProject({
  nome,
  descricao,
  dataInicio,
  cno,
  empresaId,
}: CreateProjectPayload) {
  try {
    const response = await fetchClient(`v1/empresas/${empresaId}/projetos`, {
      method: "POST",
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
        errorData.error?.message || "Ocorreu um erro ao criar o projeto."
      );
    }

    return (await response.json()) as ApiResponse<ProjectObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar o projeto.", error);
    throw error;
  }
}
