import { EPIFormData, EPIResponse } from "./epi-interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createEPI(
  epiData: EPIFormData,
  empresa: string,
  token: string
): Promise<EPIResponse> {
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/v1/empresas/${empresa}/epis`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify(epiData),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.message || "Erro ao criar setor";

    throw new Error(errorMessage);
  }

  return data;
}
