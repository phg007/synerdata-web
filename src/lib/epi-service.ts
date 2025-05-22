import { toast } from "sonner";

// Definição do tipo para EPI
export interface EPI {
  id: number;
  nome: string;
  descricao: string;
  equipamentos: string;
  status: string;
  atualizadoEm: string;
}

// Dados de exemplo para desenvolvimento
const sampleEPIs: EPI[] = [
  {
    id: 1,
    nome: "Capacete",
    descricao: "Proteção para a cabeça",
    equipamentos: "Capacete de segurança com carneira",
    status: "A",
    atualizadoEm: "26/04/2025, 16:19:37",
  },
  {
    id: 2,
    nome: "Luvas",
    descricao: "Proteção para as mãos",
    equipamentos: "Luvas de látex resistentes a produtos químicos",
    status: "A",
    atualizadoEm: "25/04/2025, 14:30:22",
  },
  {
    id: 3,
    nome: "Óculos",
    descricao: "Proteção para os olhos",
    equipamentos: "Óculos de segurança com proteção lateral",
    status: "A",
    atualizadoEm: "24/04/2025, 10:15:45",
  },
  {
    id: 4,
    nome: "Protetor Auricular",
    descricao: "Proteção para os ouvidos",
    equipamentos: "Protetor tipo plug de silicone",
    status: "I",
    atualizadoEm: "23/04/2025, 09:45:12",
  },
  {
    id: 5,
    nome: "Máscara",
    descricao: "Proteção respiratória",
    equipamentos: "Máscara PFF2 com válvula",
    status: "A",
    atualizadoEm: "22/04/2025, 11:20:33",
  },
];

// Função para obter todos os EPIs
export async function getEPIs(): Promise<EPI[]> {
  try {
    // Simulando uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [...sampleEPIs];
  } catch (error) {
    console.error("Erro ao buscar EPIs:", error);
    toast.error("Erro ao carregar EPIs");
    return [];
  }
}

// Função para obter um EPI pelo ID
export async function getEPIById(id: number): Promise<EPI | null> {
  try {
    // Simulando uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500));
    const epi = sampleEPIs.find((epi) => epi.id === id);
    return epi || null;
  } catch (error) {
    console.error(`Erro ao buscar EPI com ID ${id}:`, error);
    toast.error("Erro ao carregar dados do EPI");
    return null;
  }
}

// Função para criar um novo EPI
export async function createEPI(
  epiData: Omit<EPI, "id" | "atualizadoEm">
): Promise<EPI | null> {
  try {
    // Simulando uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const now = new Date();
    const formattedDate = now.toLocaleString("pt-BR");

    const newEPI: EPI = {
      id: Math.max(...sampleEPIs.map((e) => e.id)) + 1,
      ...epiData,
      atualizadoEm: formattedDate,
    };

    sampleEPIs.push(newEPI);
    return newEPI;
  } catch (error) {
    console.error("Erro ao criar EPI:", error);
    toast.error("Erro ao criar EPI");
    return null;
  }
}

// Função para atualizar um EPI existente
export async function updateEPI(
  id: number,
  epiData: Partial<Omit<EPI, "id" | "atualizadoEm">>
): Promise<EPI | null> {
  try {
    // Simulando uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const epiIndex = sampleEPIs.findIndex((epi) => epi.id === id);
    if (epiIndex === -1) {
      toast.error("EPI não encontrado");
      return null;
    }

    const now = new Date();
    const formattedDate = now.toLocaleString("pt-BR");

    const updatedEPI = {
      ...sampleEPIs[epiIndex],
      ...epiData,
      atualizadoEm: formattedDate,
    };

    sampleEPIs[epiIndex] = updatedEPI;
    return updatedEPI;
  } catch (error) {
    console.error(`Erro ao atualizar EPI com ID ${id}:`, error);
    toast.error("Erro ao atualizar EPI");
    return null;
  }
}

// Função para excluir um EPI
export async function deleteEPI(id: number): Promise<boolean> {
  try {
    // Simulando uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const epiIndex = sampleEPIs.findIndex((epi) => epi.id === id);
    if (epiIndex === -1) {
      toast.error("EPI não encontrado");
      return false;
    }

    sampleEPIs.splice(epiIndex, 1);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir EPI com ID ${id}:`, error);
    toast.error("Erro ao excluir EPI");
    return false;
  }
}
