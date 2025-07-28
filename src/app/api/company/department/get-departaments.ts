import { Department } from "./interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDepartments(
  empresa: string,
  token: string
): Promise<Department[]> {
  if (!token) {
    throw new Error("Autenticação necessária");
  }

  const url = `${API_BASE_URL}/v1/empresas/${empresa}/setores`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
