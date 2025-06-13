import { BaseObjectResponse } from "@/utils/interfaces/base-response";

export interface RoleObjectResponse extends BaseObjectResponse {
  nome: string;
  epis: string[];
}
