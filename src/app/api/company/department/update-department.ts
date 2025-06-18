import { DepartmentFormData, DepartmentResponse } from "./interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateDepartment(
  DepartmentData: DepartmentFormData,
  token: string,
  id: string
): Promise<DepartmentResponse> {
  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const response = await fetch(`${API_BASE_URL}/v1/empresas/setores/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(DepartmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.message || `Erro ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}
