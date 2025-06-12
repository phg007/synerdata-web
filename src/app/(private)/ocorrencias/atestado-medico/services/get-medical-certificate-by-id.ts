import { fetchClient } from "@/utils/fetch-client";
import { MedicalCertificateObjectResponse } from "../interfaces/medical-certificate-interfaces";

export async function getMedicalCertificateById(
  id: string
): Promise<MedicalCertificateObjectResponse> {
  const response = await fetchClient(`v1/funcionarios/atestados/${id}`, {
    method: "GET",
  });

  return await response.json();
}
