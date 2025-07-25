import { BaseObjectResponse } from "@/utils/interfaces/base-response";

interface Employee {
  id: string;
  nome: string;
}

export interface MedicalCertificateObjectResponse extends BaseObjectResponse {
  funcionario: Employee;
  dataInicio: string;
  cid: string;
  dataFim: string;
  motivo: string;
}
