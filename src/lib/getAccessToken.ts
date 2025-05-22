import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getAccessTokenFromCookie(): Promise<string | null> {
  const token = (await cookies()).get("next-auth.session-token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.accessToken as string;
  } catch (err) {
    console.error("JWT inválido:", err);
    return null;
  }
}
