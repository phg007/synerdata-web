import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

interface Funcao {
  id: string;
  nome: string;
}

export interface PromotionObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  funcao: Funcao;
  salario: number;
  data: string;
}
