export interface BaseObjectResponse {
  id: string;
  status: string;
  criadoPor: string;
  criadoEm: string;
  atualizadoPor: string;
  atualizadoEm: string;
}

interface Error {
  message: string;
  error: string;
  statusCode: number;
}
export interface ApiResponse<T> {
  succeeded: boolean;
  data: T | null;
  message: string;
  error?: Error;
}
