import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface Epi {
  id: string;
  nome: string;
}

export interface RoleObjectResponse extends BaseObjectResponse {
  nome: string;
  epis: Epi[];
}
