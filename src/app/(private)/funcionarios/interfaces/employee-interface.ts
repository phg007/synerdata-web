import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface RoleShortObject {
  id: string;
  nome: string;
}

interface DepartmentShortObject {
  id: string;
  nome: string;
}

interface CostCenterShortObject {
  id: string;
  nome: string;
}

interface CboShortObject {
  id: string;
  nome: string;
}

export interface EmployeeObjectResponse extends BaseObjectResponse {
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
  nomePai: string;
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
  funcao: RoleShortObject;
  setor: DepartmentShortObject;
  dataExameAdmissional: string;
  vencimentoExperiencia1?: string;
  vencimentoExperiencia2?: string;
  dataExameDemissional?: string;
  centroCusto?: CostCenterShortObject;
  grauInstrucao: string;
  gestor: string;
  cbo: CboShortObject;
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
  empresaId?: string;
  funcaoId?: string;
  setorId?: string;
  centroCustoId?: string;
  cboId?: string;
}
