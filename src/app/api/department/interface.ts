export interface Department {
  id: string;
  nome: string;
}

export interface DepartmentFormData {
  nome: string;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data?: DepartmentFormData;
}
