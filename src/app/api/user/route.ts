export const runtime = "nodejs";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface TokenData {
  sub: string;
  email: string;
  empresa: string;
  funcao: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const decodedSecret = Buffer.from(JWT_SECRET, "base64").toString("utf-8");

export async function userData(): Promise<TokenData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, decodedSecret) as TokenData;
    return decoded;
  } catch {
    return null;
  }
}
