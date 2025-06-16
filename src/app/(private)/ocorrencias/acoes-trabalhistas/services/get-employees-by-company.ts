import { fetchClient } from "@/utils/fetch-client";
import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface EmployeeObjectResponse extends BaseObjectResponse {
  status: string;
  nome: string;
  carteiraIdentidade: string;
  cpf: string;
  sexo: string;
  dataNascimento: string;
  estadoCivil: string;
  naturalidade: string;
  nacionalidade: string;
  altura: string;
  peso: string;
  nomePai: string;
  nomeMae: string;
  email: string;
  pis: string;
  ctpsNumero: string;
  ctpsSerie: string;
  certificadoReservista: string;
  regimeContratacao: string;
  dataAdmissao: string;
  salario: string;
  dataUltimoASO: string;
  funcao: string;
  setor: string;
  dataExameDemissional: string;
  grauInstrucao: string;
  necessidadesEspeciais: boolean;
  tipoDeficiencia: string | null;
  filhos: boolean;
  quantidadeFilhos: number | null;
  telefone: string | null;
  celular: string;
  gestor: string;
  cbo: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: string | null;
  longitude: string | null;
  quantidadeOnibus: number;
  cargaHoraria: string;
  escala: string;
}

export async function getEmployeesByCompany(
  companyId: string
): Promise<EmployeeObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/funcionarios`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar funcionários.");
  }

  return await response.json();
}
