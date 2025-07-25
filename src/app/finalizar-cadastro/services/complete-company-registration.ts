import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";

export interface CompleteCompanyRegistrationPayload {
  dataFundacao: string;
  faturamento: number;
  regimeTributario: string;
  inscricaoEstadual?: string;
  cnaePrincipal: string;
  segmento: string;
  ramoAtuacao: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  empresaId: string;
}

export async function completeCompanyRegistration({
  dataFundacao,
  faturamento,
  regimeTributario,
  inscricaoEstadual,
  cnaePrincipal,
  segmento,
  ramoAtuacao,
  cep,
  rua,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  empresaId,
}: CompleteCompanyRegistrationPayload) {
  try {
    const response = await fetchClient(
      `v1/empresas/${empresaId}/finalizar-cadastro`,
      {
        method: "PATCH",
        body: JSON.stringify({
          dataFundacao,
          faturamento,
          regimeTributario,
          inscricaoEstadual,
          cnaePrincipal,
          segmento,
          ramoAtuacao,
          cep,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error.message || "Ocorreu um erro criar a filial."
      );
    }

    return (await response.json()) as ApiResponse<null>;
  } catch (error) {
    console.error("Ocorreu um erro ao criar a filial.", error);
    throw error;
  }
}
