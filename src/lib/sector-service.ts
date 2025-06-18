import { getCookie } from "cookies-next";
import { toast } from "sonner";
import type {
  Sector,
  SectorFormData,
  // SectorFilters,
  // SectorPaginatedResponse,
  // SectorResponse,
} from "./interfaces/sector-interfaces";

const API_BASE_URL = "http://localhost:3001/api/v1";

export async function getUserId(): Promise<string | null> {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) return null;

    const data = await res.json();
    return data.sub || null;
  } catch {
    return null;
  }
}

// export async function getSectors(): Promise<Sector[]> {
//   try {
//     // Get auth token
//     const token = getCookie("jwt");
//     if (!token) {
//       console.error("Sector Service: No auth token found");
//       throw new Error("Authentication required");
//     }

//     try {
//       // Make real API request with Bearer token
//       const response = await fetch(`${API_BASE_URL}/empresas/1/setores`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();

//       return data;
//     } catch (fetchError) {
//       console.warn(
//         "Sector Service: Fetch failed, using mock data:",
//         fetchError
//       );

//       return [];
//     }
//   } catch (error) {
//     console.error("Sector Service: Error getting sectors:", error);
//     toast.error("Erro ao carregar setores");
//     throw error;
//   }
// }

export async function createSector(
  sectorData: SectorFormData
): Promise<Sector> {
  const token = getCookie("jwt");
  const userId = await getUserId();
  const payload = { ...sectorData, criadoPor: userId };

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/empresas/1/setores`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json(); // 👈 importante: pega o corpo sempre

  if (!response.ok) {
    const errorMessage = data?.message || "Erro ao criar setor";
    console.log("errorMessage", errorMessage);

    throw new Error(errorMessage);
    //toast.error(errorMessage);
  }

  return data;
}

export async function updateSector(sector: Sector): Promise<Sector | null> {
  console.log("Sector Service: Updating sector:", sector);

  const token = getCookie("jwt");

  if (!token) {
    console.error("Sector Service: No auth token found");

    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/sectors/${sector.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sector),
    });

    if (!response.ok) {
      console.error("API error:", response.status, response.statusText);
      toast.error("Erro ao atualizar setor");
      return null;
    }

    const data = await response.json();
    console.log("Sector Service: Sector updated successfully via API");
    return data as Sector;
  } catch (error) {
    console.error(`Sector Service: Error updating sector ${sector.id}:`, error);

    return null;
  }
}

// Função para excluir um setor
export async function deleteSector(id: string): Promise<void> {
  console.log("Sector Service: Deleting sector:", id);
  try {
    // Get auth token
    const token = getCookie("jwt");
    if (!token) {
      console.error("Sector Service: No auth token found");
      throw new Error("Authentication required");
    }

    try {
      // Make real API request with Bearer token
      const response = await fetch(`${API_BASE_URL}/sectors/${id}`, {
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

      console.log("Sector Service: Sector deleted successfully via API");
    } catch (fetchError) {
      console.warn(
        "Sector Service: Fetch failed, using mock data:",
        fetchError
      );
    }
  } catch (error) {
    console.error(
      `Sector Service: Error deleting sector with ID ${id}:`,
      error
    );
    toast.error("Erro ao excluir setor");
    throw error;
  }
}
