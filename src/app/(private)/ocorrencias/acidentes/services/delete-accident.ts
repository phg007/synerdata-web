import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { acidentesObjectResponse } from "../interfaces/accident-interfaces";

export interface DeleteAccidentPayload {
  accidentId: string;
}

export async function deleteAccident({ accidentId }: DeleteAccidentPayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/acidentes/${accidentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir o acidente."
      );
    }

    return (await response.json()) as ApiResponse<acidentesObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir o acidente:", error);
    throw error;
  }
}
