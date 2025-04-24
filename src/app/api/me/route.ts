export const runtime = "nodejs"; // ✅ garante que não está no edge

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const decodedSecret = Buffer.from(JWT_SECRET, "base64").toString("utf-8");

export async function GET() {
  const cookieStore = await cookies(); // <- agora funciona
  const token = cookieStore.get("jwt")?.value;

  if (!token) return Response.json({ sub: null }, { status: 401 });

  try {
    const decoded = jwt.verify(token, decodedSecret) as { sub: string };
    return Response.json({ sub: decoded.sub });
  } catch {
    return Response.json({ sub: null }, { status: 401 });
  }
}
