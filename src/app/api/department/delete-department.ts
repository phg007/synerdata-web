import { getCookie } from "cookies-next";
import { toast } from "sonner";

// Base API URL
const API_BASE_URL = "http://localhost:3000/api";

// Função para excluir um departmento
export async function deleteDepartment(id: string): Promise<void> {
  console.log(`Department Service: Deleting department with id ${id}`);
  try {
    // Get auth token
    const token = getCookie("jwt");
    if (!token) {
      console.error("Department Service: No auth token found");
      throw new Error("Authentication required");
    }

    try {
      // Make real API request with Bearer token
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      console.log("Department Service: Department deleted successfully in API");
    } catch (fetchError) {
      console.warn(
        "Department Service: Fetch failed, using mock data:",
        fetchError
      );

      throw new Error("Department not found");
    }
  } catch (error) {
    console.error("Department Service: Error deleting department:", error);
    toast.error("Erro ao excluir departmento");
    throw error;
  }
}
