import { getUserId } from "@/lib/auth";
import { getCookie } from "cookies-next";
import { DepartmentFormData, DepartmentResponse } from "./interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createDepartment(
  departmentData: DepartmentFormData
): Promise<DepartmentResponse> {
  const token = getCookie("jwt");
  const userId = await getUserId();

  const payload = { ...departmentData, criadoPor: userId };
  if (!token) {
    throw new Error("Authentication required");
  }

  if (!userId) {
    throw new Error("ID do usuário não encontrado");
  }

  const response = await fetch(`${API_BASE_URL}/v1/empresas/1/setores`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.message || "Erro ao criar setor";

    throw new Error(errorMessage);
  }

  return data;
}
