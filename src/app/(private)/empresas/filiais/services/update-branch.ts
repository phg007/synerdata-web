import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { BranchObjectResponse } from "../interfaces/branch-interface";

export interface UpdateBranchPayload {
  branchId: string;
  nome: string;
  cnpj: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  dataFundacao: string;
  telefone?: string;
  celular: string;
}

export async function updateBranch({
  branchId,
  nome,
  cnpj,
  rua,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  cep,
  dataFundacao,
  telefone,
  celular,
}: UpdateBranchPayload) {
  try {
    const response = await fetchClient(`v1/empresas/filiais/${branchId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nome,
        cnpj,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        dataFundacao,
        telefone,
        celular,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao atualizar a filial."
      );
    }

    return (await response.json()) as ApiResponse<BranchObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar a filial.", error);
    throw error;
  }
}
