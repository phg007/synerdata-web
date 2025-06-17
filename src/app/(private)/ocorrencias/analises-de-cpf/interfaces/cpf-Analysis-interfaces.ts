import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

export interface CpfAnalysisObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  descricao: string;
}
