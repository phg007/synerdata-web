import { fetchClient } from "@/utils/fetch-client";
import { BaseResponse } from "@/utils/interfaces/base-response";

export interface GetBranchesByCompanyResponse extends BaseResponse {
  nome: string;
  cnpj: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  dataFundacao: string;
  telefone: string;
  celular: string;
}

export async function getBranchesByCompany(
  companyId: string
): Promise<GetBranchesByCompanyResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/filiais`, {
    method: "GET",
  });

  return await response.json();
}
