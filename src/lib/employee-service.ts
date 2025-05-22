import { getCookie } from "cookies-next";
import type { Employee } from "@/app/(private)/funcionarios/_components/employee-form-modal";

const API_BASE_URL = "http://localhost:3001/api/v1";

export const employeeService = {
  getEmployees: async () => {
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Employee API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/empresas/1/funcionarios`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Employee API: Employees fetched successfully from API");
        return data;
      } catch (fetchError) {
        console.warn(
          "Employee API: Fetch failed, using mock data:",
          fetchError
        );
        return [];
      }
    } catch (error) {
      console.error("Employee API: Error getting employees:", error);
      throw new Error("Failed to fetch employees");
    }
  },

  getEmployeeById: async (id: string) => {
    console.log("Employee API: Getting employee by ID:", id);
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Employee API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        // Make real API request with Bearer token
        const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
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
        console.log("Employee API: Employee fetched successfully from API");
        return data;
      } catch (fetchError) {
        console.warn(
          "Employee API: Fetch failed, using mock data:",
          fetchError
        );
      }
    } catch (error) {
      console.error("Employee API: Error getting employee by ID:", error);
      throw error;
    }
  },

  createEmployee: async (employeeData: Omit<Employee, "id">) => {
    console.log("Employee API: Creating employee:", employeeData);
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Employee API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        // Make real API request with Bearer token
        const response = await fetch(`${API_BASE_URL}/employees`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Employee API: Employee created successfully via API");
        return data;
      } catch (fetchError) {
        console.warn(
          "Employee API: Fetch failed, using mock data:",
          fetchError
        );
      }
    } catch (error) {
      console.error("Employee API: Error creating employee:", error);
      throw new Error("Failed to create employee");
    }
  },

  updateEmployee: async (employeeData: Employee) => {
    console.log("Employee API: Updating employee:", employeeData);
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Employee API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        // Make real API request with Bearer token
        const response = await fetch(
          `${API_BASE_URL}/employees/${employeeData.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Employee API: Employee updated successfully via API");
        return data;
      } catch (fetchError) {
        console.warn(
          "Employee API: Fetch failed, using mock data:",
          fetchError
        );
        return [];
        // Fallback to mock data if API request fails
      }
    } catch (error) {
      console.error("Employee API: Error updating employee:", error);
      throw new Error("Failed to update employee");
    }
  },

  deleteEmployee: async (id: string) => {
    console.log("Employee API: Deleting employee:", id);
    try {
      // Get auth token
      const token = getCookie("jwt");
      if (!token) {
        console.error("Employee API: No auth token found");
        throw new Error("Authentication required");
      }

      try {
        // Make real API request with Bearer token
        const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
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

        console.log("Employee API: Employee deleted successfully via API");
        return { success: true };
      } catch (fetchError) {
        console.warn(
          "Employee API: Fetch failed, using mock data:",
          fetchError
        );
      }
    } catch (error) {
      console.error("Employee API: Error deleting employee:", error);
      throw new Error("Failed to delete employee");
    }
  },
};
