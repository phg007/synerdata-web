import { EPI, EPIResponse } from "./epi-interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateEPI(
  epiData: EPI,
  token: string
): Promise<EPIResponse> {
  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/empresas/epis/${epiData.id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(epiData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.message || `Erro ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}
