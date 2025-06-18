import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface ProjectObjectResponse extends BaseObjectResponse {
  nome: string;
  descricao: string;
  dataInicio: string;
  cno: string;
}
