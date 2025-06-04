import { fetchClient } from "@/utils/fetch-client";
import { GetBranchesByCompanyResponse } from "./get-branches-by-company";

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

export interface CreateBranchResponse {
  succeeded: boolean;
  data: GetBranchesByCompanyResponse;
  message: string;
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
}: CreateBranchPayload): Promise<CreateBranchResponse> {
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
        errorData.error.message || "Ocorreu um erro ao convidar o usuário."
      );
    }

    const createBranchResponse: CreateBranchResponse = await response.json();

    return createBranchResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao convidar o usuário.", error);
    throw error;
  }
}
