import { fetchClient } from "@/utils/fetch-client";
import { EmployeeObjectResponse } from "../interfaces/employee-interface";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CreateEmployeeFormValues {
  nome: string;
  carteiraIdentidade: string;
  cpf: string;
  sexo: string;
  dataNascimento: string;
  estadoCivil: string;
  naturalidade: string;
  nacionalidade: string;
  altura: number;
  peso: number;
  nomePai?: string;
  nomeMae: string;
  email: string;
  pis: string;
  ctpsNumero: string;
  ctpsSerie: string;
  certificadoReservista: string;
  regimeContratacao: string;
  dataAdmissao: string;
  salario: number;
  valorAlimentacao: number;
  valorTransporte: number;
  dataUltimoASO?: string;
  funcao: string;
  setor: string;
  dataExameAdmissional: string;
  vencimentoExperiencia1?: string;
  vencimentoExperiencia2?: string;
  dataExameDemissional?: string;
  centroCusto?: string;
  grauInstrucao: string;
  gestor: string;
  cbo: string;
  cargaHoraria: number;
  escala: string;
  necessidadesEspeciais: boolean;
  tipoDeficiencia?: string;
  filhos: boolean;
  quantidadeFilhos?: number;
  filhosAbaixoDe21?: boolean;
  telefone?: string;
  celular: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude?: number;
  longitude?: number;
  quantidadeOnibus?: number;
  funcaoId?: string;
  setorId?: string;
  centroCustoId?: string;
  cboId?: string;
}

interface CreateEmployeePayload {
  empresaId?: string;
  data: CreateEmployeeFormValues;
}

export async function createEmployee({
  empresaId,
  data,
}: CreateEmployeePayload) {
  try {
    const response = await fetchClient(
      `v1/empresas/${empresaId}/funcionarios`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro criar o funcionário."
      );
    }

    return (await response.json()) as ApiResponse<EmployeeObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar o funcionário.", error);
    throw error;
  }
}
