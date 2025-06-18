import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

export interface AcidentesObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  descricao: string;
  data: string;
  natureza: string;
  cat: string;
  medidasTomadas: string;
}
