import { fetchClient } from "@/utils/fetch-client";
import { ApiResponse } from "@/utils/interfaces/base-response";
import { MedicalCertificateObjectResponse } from "../interfaces/medical-certificate-interfaces";

export interface DeleteMedicalCertificatePayload {
  certificateId: string;
}

export async function deleteMedicalCertificate({
  certificateId,
}: DeleteMedicalCertificatePayload) {
  try {
    const response = await fetchClient(
      `v1/funcionarios/atestados/${certificateId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Ocorreu um erro ao excluir o atestado."
      );
    }

    return (await response.json()) as ApiResponse<MedicalCertificateObjectResponse>;
  } catch (error) {
    console.error("Erro ao excluir o atestado:", error);
    throw error;
  }
}
