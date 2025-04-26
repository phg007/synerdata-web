import type { Company } from "@/components/company-form-modal";
import { getCookie } from "cookies-next";

const API_BASE_URL = "http://localhost:3001/api/v1";

async function getUserId(): Promise<string | null> {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) return null;

    const data = await res.json();
    return data.sub || null;
  } catch {
    return null;
  }
}

export const companyService = {
  getCompanies: async () => {
    console.log("Company API: Getting companies");
    try {
      const token = getCookie("jwt");

      if (!token) {
        console.error("Company API: No auth token found");
        throw new Error("Authentication required");
      }

      console.log("Company API: Auth token present, making API request");

      try {
        // Make real API request with Bearer token
        const response = await fetch(`${API_BASE_URL}/empresas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Company API: Companies fetched successfully from API");
        return data;
      } catch (fetchError) {
        console.warn("Company API: Fetch failed, using mock data:", fetchError);
        // Fallback to mock data if API request fails

        return null;
      }
    } catch (error) {
      console.error("Company API: Error getting companies:", error);
      throw new Error("Failed to fetch companies");
    }
  },

  // Get company by ID
  getCompanyById: async (id: string) => {
    console.log("Company API: Getting company by ID:", id);
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Company API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        // Make real API request with Bearer token
        const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Company API: Company fetched successfully from API");
        return data;
      } catch (fetchError) {
        console.warn("Company API: Fetch failed, using mock data:", fetchError);

        return null;
      }
    } catch (error) {
      console.error("Company API: Error getting company by ID:", error);
      throw error;
    }
  },

  createCompany: async (companyData: Omit<Company, "id">) => {
    console.log("Company API: Creating company:", companyData);
    try {
      const token = getCookie("jwt");
      const atualizadoPor = await getUserId();
      if (!token) {
        console.error("Company API: No auth token found");
        throw new Error("Authentication required");
      }
      if (!atualizadoPor) {
        throw new Error("Falha ao capturar ID do usuário autenticado");
      }

      try {
        const response = await fetch(`${API_BASE_URL}/empresas`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyData),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Company API: Company created successfully via API");
        return data;
      } catch (fetchError) {
        console.warn("Company API: Fetch failed,", fetchError);

        // return null;
      }
    } catch (error) {
      console.error("Company API: Error creating company:", error);
      throw new Error("Failed to create company");
    }
  },

  // Update company
  updateCompany: async (companyData: Company) => {
    console.log("Company API: Updating company:", companyData);
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Company API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        // Make real API request with Bearer token
        const response = await fetch(
          `${API_BASE_URL}/companies/${companyData.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(companyData),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Company API: Company updated successfully via API");
        return data;
      } catch (fetchError) {
        console.warn("Company API: Fetch failed, using mock data:", fetchError);
        return null;
      }
    } catch (error) {
      console.error("Company API: Error updating company:", error);
      throw new Error("Failed to update company");
    }
  },

  // Delete company
  deleteCompany: async (id: string) => {
    console.log("Company API: Deleting company:", id);
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Company API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        // Make real API request with Bearer token
        const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        console.log("Company API: Company deleted successfully via API");
        return { success: true };
      } catch (fetchError) {
        console.warn("Company API: Fetch failed, using mock data:", fetchError);
        return null;
      }
    } catch (error) {
      console.error("Company API: Error deleting company:", error);
      throw new Error("Failed to delete company");
    }
  },
};
