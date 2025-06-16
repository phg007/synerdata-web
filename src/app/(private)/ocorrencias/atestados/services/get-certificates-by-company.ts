import { fetchClient } from "@/utils/fetch-client";
import { MedicalCertificateObjectResponse } from "../interfaces/certificate-interfaces";

export async function getMedicalCertificatesByCompany(
  companyId: string
): Promise<MedicalCertificateObjectResponse[]> {
  const response = await fetchClient(`v1/empresas/${companyId}/atestados`, {
    method: "GET",
  });

  return await response.json();
}
