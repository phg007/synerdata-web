import { getSession } from "next-auth/react";

export interface ImportResult {
  totalRows: number;
  inserted: number;
  updated: number;
  skipped: number;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
}

export interface ErrorData {
  message: string;
  errors: ImportError[];
}

export interface BackendErrorResponse {
  succeeded: boolean;
  data: null;
  message: string;
  error: ErrorData;
}

export interface ErrorResponse {
  message?: string;
  errors?: ImportError[];
}

export async function importEmployees(
  companyId: string,
  file: File
): Promise<ImportResult> {
  const formData = new FormData();
  formData.append("file", file);

  const session = await getSession();
  const headers: HeadersInit = {};

  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/empresas/${companyId}/funcionarios/importar`,
    {
      method: "POST",
      body: formData,
      headers,
    }
  );

  if (!response.ok) {
    const errorData: BackendErrorResponse = await response.json();
    throw {
      status: response.status,
      data: errorData.error,
      message: errorData.message,
    };
  }

  return response.json() as Promise<ImportResult>;
}
