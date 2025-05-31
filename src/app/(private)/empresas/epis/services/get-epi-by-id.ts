import { EPI } from "./epi-interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEPIById(id: string, token: string): Promise<EPI> {
  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const response = await fetch(`${API_BASE_URL}/v1/empresas/epis/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data: EPI = await response.json();

  console.log("resposta bruta da API:", JSON.stringify(data, null, 2));
  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }

  return data;
}
