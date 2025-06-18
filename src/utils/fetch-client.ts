import { getSession } from "next-auth/react";

const API_URL = process.env.API_URL;

export async function fetchClient(
  url: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession();

  const headers = new Headers(options.headers || {});

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}
