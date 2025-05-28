// lib/get-api-token.ts
import { cookies } from "next/headers";

export async function getApiToken(): Promise<string | null> {
  const cookieStore = await cookies(); // <- await adicionado aqui
  return cookieStore.get("api_token")?.value || null;
}
