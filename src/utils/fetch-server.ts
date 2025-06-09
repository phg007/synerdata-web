import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function fetchServer(
  url: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getServerSession(authOptions);

  const headers = new Headers(options.headers || {});

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`http://host.docker.internal:3001/api/${url}`, {
    ...options,
    headers,
  });
}
