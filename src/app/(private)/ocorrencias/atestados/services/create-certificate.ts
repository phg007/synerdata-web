import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { MedicalCertificateObjectResponse } from "../interfaces/certificate-interfaces";

export interface CreateMedicalCertificatePayload {
  motivo: string;
  cid?: string;
  dataInicio: string;
  dataFim: string;
  funcionarioId: string;
}

export async function createMedicalCertificate({
  motivo,
  cid,
  dataInicio,
  dataFim,
  funcionarioId,
}: CreateMedicalCertificatePayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/${funcionarioId}/atestados`,
      {
        method: "POST",
        body: JSON.stringify({
          motivo,
          cid,
          dataInicio,
          dataFim,
        }),
      }
    );

    const responseData =
      (await response.json()) as ApiResponse<MedicalCertificateObjectResponse>;

    if (!response.ok) {
      const errorMessage =
        responseData?.message || "Erro ao criar atestado médico";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao criar atestado médico:", error);
    throw error;
  }
}
