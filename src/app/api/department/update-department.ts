import { getCookie } from "cookies-next";

const API_BASE_URL = "http://localhost:3001/api/v1";

export interface Department {
  id: string;
  nome: string;
  status: "A" | "I";
}

export async function updateDepartment(
  department: Department
): Promise<{ success: boolean; message: string }> {
  const token = getCookie("jwt");
  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const response = await fetch(`${API_BASE_URL}/departments/${department.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.message || `Erro ${response.status}`;
    console.log(errorMessage);
  }

  return data; // Ex: { success: true, message: "Setor atualizado com sucesso" }
}
