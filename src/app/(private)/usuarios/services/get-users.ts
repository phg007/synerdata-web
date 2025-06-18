import { fetchClient } from "@/utils/fetch-client";

export interface GetUserResponse {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  status: string;
  empresa: string;
  criadoPor: string | null;
}

export async function getUsers(): Promise<GetUserResponse[]> {
  const response = await fetchClient("v1/usuarios", {
    method: "GET",
  });

  return await response.json();
}
