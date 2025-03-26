import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  (await cookieStore).delete("jwt");

  return NextResponse.json(
    { message: "Logout realizado com sucesso" },
    {
      status: 200,
      headers: {
        "Set-Cookie":
          "jwt=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    }
  );
}
