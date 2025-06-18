// Interface para dados do formulário de Setor
export interface SectorFormData {
  nome: string;
  status: "A" | "I";
}

// Interface completa para Setor
export interface Sector extends SectorFormData {
  id: string;
  atualizadoEm?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para filtros de busca de Setores
export interface SectorFilters {
  nome?: string;
  status?: "A" | "I";
}

// Interface para resposta paginada de Setores
export interface SectorPaginatedResponse {
  data: Sector[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface para estatísticas de Setores
export interface SectorStats {
  total: number;
  ativos: number;
  inativos: number;
}

// Interface para resposta de operações com Setores
export interface SectorResponse {
  success: boolean;
  message: string;
  data?: Sector;
}
