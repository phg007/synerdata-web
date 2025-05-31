import { EPI } from "./epi-interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEPIs(empresa: string, token: string): Promise<EPI[]> {
  if (!token) {
    throw new Error("Autenticação necessária");
  }

  const url = `${API_BASE_URL}/v1/empresas/${empresa}/epis`;
  console.log("🌐 Requisição:", url);

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
