import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface BranchObjectResponse extends BaseObjectResponse {
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
