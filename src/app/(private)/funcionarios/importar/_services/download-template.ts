import { fetchClient } from "@/utils/fetch-client";

export async function downloadTemplate() {
  return await fetchClient("v1/funcionarios/template-importacao", {
    method: "GET",
  });
}
