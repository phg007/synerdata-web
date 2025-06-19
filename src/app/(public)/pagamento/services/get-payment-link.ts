import { fetchClient } from "@/utils/fetch-client";

export interface GetPaymentLinkPayload {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone?: string;
  celular: string;
  tipoPlano: string;
  quantidadeFuncionarios: string;
  preco: number;
}

interface GetPaymentLinkResponse {
  url: string;
}

export async function getPaymentLink(data: GetPaymentLinkPayload) {
  try {
    const response = await fetchClient("v1/payments/generate-link", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message || "Ocorreu um erro ao gerar o link de pagamento."
      );
    }

    return (await response.json()) as GetPaymentLinkResponse;
  } catch (error) {
    console.error("Ocorreu um erro ao gerar o link de pagamento:", error);
    throw error;
  }
}
