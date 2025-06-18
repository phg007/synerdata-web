import { DepartmentFormData, DepartmentResponse } from "./interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createDepartment(
  departmentData: DepartmentFormData,
  empresa: string,
  token: string
): Promise<DepartmentResponse> {
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/empresas/${empresa}/setores`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(departmentData),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.message || "Erro ao criar setor";

    throw new Error(errorMessage);
  }

  return data;
}
