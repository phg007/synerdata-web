import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { MedicalCertificateObjectResponse } from "../interfaces/certificate-interfaces";

export interface UpdateMedicalCertificatePayload {
  certificateId: string;
  dataInicio: string;
  cid?: string;
  dataFim: string;
  motivo: string;
}

export async function updateMedicalCertificate({
  certificateId,
  motivo,
  cid,
  dataInicio,
  dataFim,
}: UpdateMedicalCertificatePayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/atestados/${certificateId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          motivo,
          cid,
          dataInicio,
          dataFim,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao atualizar o atestado."
      );
    }

    return (await response.json()) as ApiResponse<MedicalCertificateObjectResponse>;
  } catch (error) {
    console.error("Erro ao atualizar o atestado:", error);
    throw error;
  }
}
