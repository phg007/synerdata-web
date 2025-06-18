import { fetchClient } from "@/utils/fetch-client";
import { BranchObjectResponse } from "../interfaces/branch-interface";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateBranchPayload {
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
  empresaId: string;
}

export async function createBranch({
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
  empresaId,
}: CreateBranchPayload) {
  try {
    const response = await fetchClient(`v1/empresas/${empresaId}/filiais`, {
      method: "POST",
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
        errorData.error.message || "Ocorreu um erro criar a filial."
      );
    }

    return (await response.json()) as ApiResponse<BranchObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar a filial.", error);
    throw error;
  }
}
