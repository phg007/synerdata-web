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
  getUsers(): Promise<User[]>;
  createUser(userData: Omit<User, "id" | "status">): Promise<ApiResponse>;
}

// API service
export const userService: UserService = {
  getUsers: async (): Promise<User[]> => {
    console.log("API Service: Getting users");
    try {
      // Get auth token

      const token = getCookie("jwt");
      console.log(`Token chamdo ${token}`);
      if (!token) {
        console.error("API Service: No auth token found");
        throw new Error("Authentication required");
      }

      console.log("API Service: Auth token present, making API request");

      try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
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

        const data = (await response.json()) as User[];
        return data;
      } catch (fetchError) {
        console.warn("API Service:Falha na busca ", fetchError);
        throw new Error("Falha ao buscar usuários");
      }
    } catch (error) {
      console.error("API Service: Erro ao obter usuários:", error);
      throw new Error("Falha ao buscar usuários");
    }
  },

  createUser: async (userData: Omit<User, "id">): Promise<ApiResponse> => {
    console.log("API Service: Creating user:", userData);
    // try {
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
};
