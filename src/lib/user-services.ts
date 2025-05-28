import { getCookie } from "cookies-next";

const API_BASE_URL = "http://localhost:3001/api/v1";

// Interfaces para tipagem
interface User {
  id: string;
  nome: string;
  email: string;
  funcao: "admin" | "manager" | "viewer";
  status: "ativo" | "inativo";
}

interface ApiResponse {
  success: boolean;
  data: User | null;
  message: string;
}

// Interface para o serviço de usuários
interface UserService {
  getUsers(token: string): Promise<User[]>;
  createUser(userData: Omit<User, "id" | "status">): Promise<ApiResponse>;
  updateUser(userData: Partial<User> & { id: string }): Promise<User>;
}

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

export const userService: UserService = {
  getUsers: async (token: string): Promise<User[]> => {
    if (!token) {
      console.error("API Service: No auth token found");
      throw new Error("Authentication required");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // pode ser omitido se não houver cookies cross-origin
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as User[];
      return data;
    } catch (fetchError) {
      console.warn("API Service: Falha na busca", fetchError);
      throw new Error("Falha ao buscar usuários");
    }
  },

  createUser: async (userData: Omit<User, "id">): Promise<ApiResponse> => {
    console.log("API Service: Creating user:", userData);
    const token = getCookie("jwt");
    if (!token) {
      console.error("API Service: No auth token found");
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await response.json();

    return data;
  },

  updateUser: async (
    userData: Partial<User> & { id: string }
  ): Promise<User> => {
    console.log("API Service: Updating user:", userData);
    try {
      const token = getCookie("jwt");
      const atualizadoPor = await getUserId();

      if (!token) {
        console.error("API Service: No auth token found");
        throw new Error("Authentication required");
      }

      if (!atualizadoPor) {
        throw new Error("Falha ao capturar ID do usuário autenticado");
      }

      const apiData = {
        nome: userData.nome,
        funcao: userData.funcao,
        atualizadoPor: Number(atualizadoPor),
      };

      try {
        const response = await fetch(
          `${API_BASE_URL}/usuarios/${userData.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = (await response.json()) as User;
        console.log("API Service: User updated successfully via API");
        return data;
      } catch (fetchError) {
        console.warn("API Service: Fetch failed, using mock data:", fetchError);
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("API Service: Error updating user:", error);
      throw new Error("Failed to update user");
    }
  },
};
