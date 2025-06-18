import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

export interface VacationObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  dataInicio: string;
  dataFim: string;
}
