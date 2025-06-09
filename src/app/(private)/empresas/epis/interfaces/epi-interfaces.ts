import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface EpiObjectResponse extends BaseObjectResponse {
  nome: string;
  descricao: string;
  equipamentos: string;
}
