import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { EmployeeObjectResponse } from "../interfaces/employee-interface";

export interface UpdateEmployeePayload {
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
  dataUltimoASO?: string;
  funcao: string;
  setor: string;
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
  employeeId?: string;
}

export async function updateEmployee({
  nome,
  carteiraIdentidade,
  cpf,
  sexo,
  dataNascimento,
  estadoCivil,
  naturalidade,
  nacionalidade,
  altura,
  peso,
  nomePai,
  nomeMae,
  email,
  pis,
  ctpsNumero,
  ctpsSerie,
  certificadoReservista,
  regimeContratacao,
  dataAdmissao,
  salario,
  dataUltimoASO,
  funcao,
  setor,
  vencimentoExperiencia1,
  vencimentoExperiencia2,
  dataExameDemissional,
  centroCusto,
  grauInstrucao,
  gestor,
  cbo,
  cargaHoraria,
  escala,
  necessidadesEspeciais,
  tipoDeficiencia,
  filhos,
  quantidadeFilhos,
  telefone,
  celular,
  rua,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  cep,
  latitude,
  longitude,
  quantidadeOnibus,
  funcaoId,
  setorId,
  centroCustoId,
  cboId,
  employeeId,
}: UpdateEmployeePayload) {
  try {
    const response = await fetchClient(
      `v1/empresas/funcionarios/${employeeId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          nome,
          carteiraIdentidade,
          cpf,
          sexo,
          dataNascimento,
          estadoCivil,
          naturalidade,
          nacionalidade,
          altura,
          peso,
          nomePai,
          nomeMae,
          email,
          pis,
          ctpsNumero,
          ctpsSerie,
          certificadoReservista,
          regimeContratacao,
          dataAdmissao,
          salario,
          dataUltimoASO,
          funcao,
          setor,
          vencimentoExperiencia1,
          vencimentoExperiencia2,
          dataExameDemissional,
          centroCusto,
          grauInstrucao,
          gestor,
          cbo,
          cargaHoraria,
          escala,
          necessidadesEspeciais,
          tipoDeficiencia,
          filhos,
          quantidadeFilhos,
          telefone,
          celular,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          cep,
          latitude,
          longitude,
          quantidadeOnibus,
          funcaoId,
          setorId,
          centroCustoId,
          cboId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro ao atualizar o funcionário."
      );
    }

    return (await response.json()) as ApiResponse<EmployeeObjectResponse>;
  } catch (error) {
    console.error("Ocorreu um erro ao atualizar o funcionário.", error);
    throw error;
  }
}
