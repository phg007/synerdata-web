import { getSession } from "next-auth/react";

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

  return fetch(`http://localhost:3001/api/${url}`, {
    ...options,
    headers,
  });
}
