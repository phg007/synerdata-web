import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

export interface TerminationObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  data: string;
  motivoInterno: string;
  motivoTrabalhista: string;
  acaoTrabalhista: string;
  formaDemissao: string;
}
