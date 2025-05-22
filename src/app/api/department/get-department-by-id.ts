import { toast } from "sonner";
import { authService } from "@/lib/auth-service";
import { mockDepartments, type Department } from "./get-departments";

// Base API URL
const API_BASE_URL = "http://localhost:3000/api";

// Helper para simular delay de API
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Função para obter um departmento por ID
export async function getDepartmentById(
  id: string
): Promise<Department | null> {
  console.log(`Department Service: Getting department with id ${id}`);
  try {
    // Get auth token
    const token = authService.getToken();
    if (!token) {
      console.error("Department Service: No auth token found");
      throw new Error("Authentication required");
    }

    try {
      // Make real API request with Bearer token
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(
        "Department Service: Department fetched successfully from API"
      );
      return data;
    } catch (fetchError) {
      console.warn(
        "Department Service: Fetch failed, using mock data:",
        fetchError
      );
      // Fallback to mock data if API request fails
      await delay(800);
      const department = mockDepartments.find((d) => d.id === id) || null;
      return department;
    }
  } catch (error) {
    console.error("Department Service: Error getting department:", error);
    toast.error("Erro ao carregar departmento");
    throw error;
  }
}
