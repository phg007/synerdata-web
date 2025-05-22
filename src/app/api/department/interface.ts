export interface Department {
  id: string;
  nome: string;
  status: "A" | "I";
}

export interface DepartmentFormData {
  nome: string;
  status: "A" | "I";
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data?: DepartmentFormData;
}
