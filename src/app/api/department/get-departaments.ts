import { getCookie } from "cookies-next";
import { Department } from "./interface";
const API_BASE_URL = "http://localhost:3001/api/v1";

export async function getDepartments(): Promise<Department[]> {
  const token = getCookie("jwt");

  if (!token) {
    throw new Error("Autenticação necessária");
  }

  const response = await fetch(`${API_BASE_URL}/empresas/1/setores`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  const data: Department[] = await response.json();
  return data;
}
