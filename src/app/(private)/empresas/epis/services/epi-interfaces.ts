/**
 * Interfaces para o serviço de EPI (Equipamento de Proteção Individual)
 */

/**
 * Interface para os dados do formulário de EPI
 * Contém os campos necessários para criar ou atualizar um EPI
 */
export interface EPIFormData {
  nome: string;
  descricao: string;
  equipamentos: string;
}

/**
 * Interface completa para um EPI
 * Estende EPIFormData e adiciona campos como ID e timestamps
 */
export interface EPI extends EPIFormData {
  id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface para filtros de busca de EPIs
 */
export interface EPIFilters {
  nome?: string;
  equipamentos?: string;
}

/**
 * Interface para resposta paginada de EPIs
 */
export interface EPIPaginatedResponse {
  data: EPI[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface para estatísticas de EPIs
 */
export interface EPIStats {
  total: number;
  porEquipamento: Record<string, number>;
}

/**
 * Interface para resposta de operações de EPI
 */
export interface EPIResponse {
  success: boolean;
  message: string;
  data?: EPI;
}
