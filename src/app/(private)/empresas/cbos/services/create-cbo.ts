import { fetchClient } from "@/utils/fetch-client";
import { CboObjectResponse } from "../interfaces/cbo-interface";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateCboPayload {
  nome: string;
  empresaId: string;
}

export async function createCbo({ nome, empresaId }: CreateCboPayload) {
  try {
    const response = await fetchClient(`v1/empresas/${empresaId}/cbos`, {
      method: "POST",
      body: JSON.stringify({
        nome,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro criar o cbo."
      );
    }

    return (await response.json()) as ApiResponse<CboObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar o cbo.", error);
    throw error;
  }
}
