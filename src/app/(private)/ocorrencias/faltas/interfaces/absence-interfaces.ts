import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}
export interface AbsencesObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  data: string;
  motivo: string;
}
