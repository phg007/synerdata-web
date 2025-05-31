const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteEPI(
  token: string,
  id: string
): Promise<{ message: string }> {
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/v1/empresas/epis/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.message || "Erro ao excluir setor";
    throw new Error(errorMessage);
  }

  return data;
}
