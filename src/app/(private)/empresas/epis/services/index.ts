import { getEPIs } from "./get-epis";
import { getEPIById } from "./get-epi-by-id";
import { createEPI } from "./create-epi";
import { updateEPI } from "./update-epi";
import { deleteEPI } from "./delete-epi";

// Exportar todas as funções individualmente
export { getEPIs, getEPIById, createEPI, updateEPI, deleteEPI };

// Exportar também como um objeto de serviço
export const epiService = {
  getEPIs,
  getEPIById,
  createEPI,
  updateEPI,
  deleteEPI,
};
