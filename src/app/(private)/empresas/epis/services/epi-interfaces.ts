export interface EpiData {
  nome: string;
  descricao: string;
  equipamentos: string;
}

export interface GetEpiResponseData extends EpiData {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface EpiApiResponse {
  success: boolean;
  message: string;
  data?: GetEpiResponseData;
}
