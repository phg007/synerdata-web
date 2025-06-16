import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

export interface LaborActionObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  numeroProcesso: string;
  tribunal: string;
  dataAjuizamento: string;
  reclamante: string;
  reclamado: string;
  advogadoReclamante?: string;
  advogadoReclamado?: string;
  descricao: string;
  valorCausa?: number;
  andamento?: string;
  decisao?: string;
  dataConclusao?: string;
  recursos?: string;
  custasDespesas?: number;
  dataConhecimento: string;
}
