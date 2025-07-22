import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface CompanyObjectResponse extends BaseObjectResponse {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  dataFundacao: string;
  email: string;
  telefone?: string;
  celular: string;
  faturamento: number;
  regimeTributario: string;
  inscricaoEstadual: string;
  cnaePrincipal: string;
  segmento: string;
  ramoAtuacao: string;
  logoUrl?: string;
  pbUrl?: string;
  quantidadeFuncionarios: string;
  plano: string;
  idAssinatura: string;
}
