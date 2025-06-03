import { fetchClient } from "@/utils/fetch-client";

export interface GetUsersByCompanyResponse {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  status: string;
  empresa: string;
  criadoPor: string | null;
}

export async function getUsersByCompany(
  companyId: string
): Promise<GetUsersByCompanyResponse[]> {
  const response = await fetchClient(`v1/usuarios/empresa/${companyId}`, {
    method: "GET",
  });

  return await response.json();
}
