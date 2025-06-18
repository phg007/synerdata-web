import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

interface Epi {
  id: string;
  nome: string;
}

export interface EpiDeliveryObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  data: string;
  epis: Epi[];
  motivo: string;
  entreguePor: string;
}
