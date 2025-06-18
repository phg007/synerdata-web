// Dados de exemplo para cargos
export type Role = {
  id: number;
  nome: string;
  status: string; // ou "A" | "I" se quiser mais restrito
};

const rolesData: Role[] = [
  { id: 1, nome: "Analista de Sistemas", status: "A" },
  { id: 2, nome: "Desenvolvedor Frontend", status: "A" },
  { id: 3, nome: "Desenvolvedor Backend", status: "A" },
  { id: 4, nome: "Gerente de Projetos", status: "A" },
  { id: 5, nome: "Designer UX/UI", status: "A" },
  { id: 6, nome: "Analista de Qualidade", status: "I" },
  { id: 7, nome: "DevOps Engineer", status: "A" },
  { id: 8, nome: "Arquiteto de Software", status: "A" },
  { id: 9, nome: "Analista de Dados", status: "A" },
  { id: 10, nome: "Especialista em Segurança", status: "I" },
];

// Função para obter todos os cargos
export async function getRoles(): Promise<Role[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [...rolesData];
}

// Função para obter um cargo por ID
export async function getRoleById(id: number): Promise<Role | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return rolesData.find((role) => role.id === id);
}

// Função para criar um novo cargo
export async function createRole(roleData: Omit<Role, "id">): Promise<Role> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newRole: Role = {
    id: rolesData.length + 1,
    ...roleData,
  };

  rolesData.push(newRole);
  return newRole;
}

// Função para atualizar um cargo existente
export async function updateRole(roleData: Role): Promise<Role> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const index = rolesData.findIndex((role) => role.id === roleData.id);
  if (index === -1) {
    throw new Error("Cargo não encontrado");
  }

  rolesData[index] = {
    ...rolesData[index],
    ...roleData,
  };

  return rolesData[index];
}

// Função para excluir um cargo
export async function deleteRole(id: number): Promise<Role> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const index = rolesData.findIndex((role) => role.id === id);
  if (index === -1) {
    throw new Error("Cargo não encontrado");
  }

  const deletedRole = rolesData.splice(index, 1)[0];
  return deletedRole;
}
