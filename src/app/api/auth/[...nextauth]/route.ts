// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log("❌ Nenhuma credencial fornecida");
          return null;
        }

        try {
          // 1. Login na API externa
          const loginRes = await fetch(
            "http://host.docker.internal:3001/api/v1/auth/sign-in",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                senha: credentials.password,
              }),
            }
          );

          if (!loginRes.ok) {
            const errorText = await loginRes.text();
            console.log("❌ Erro ao fazer login:", loginRes.status, errorText);
            return null;
          }

          const loginData = await loginRes.json();
          const token = loginData?.data?.access_token;

          if (!token) return null;

          // 2. Decodifica o token para extrair o userId (sub)
          const [, payloadBase64] = token.split(".");
          const payloadJson = JSON.parse(
            Buffer.from(payloadBase64, "base64").toString()
          );
          const userId = payloadJson.sub;

          (await cookies()).set("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1, // 1 hora
          });

          if (!userId) {
            console.log(
              "❌ Token válido, mas sub (userId) ausente:",
              payloadJson
            );
            return null;
          }

          // 3. Buscar dados do usuário
          const userRes = await fetch(
            `http://host.docker.internal:3001/api/v1/usuarios/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!userRes.ok) {
            const userError = await userRes.text();
            console.log(
              "❌ Erro ao buscar dados do usuário:",
              userRes.status,
              userError
            );
            return null;
          }

          const user = await userRes.json();
          console.log("👤 Dados do usuário recebidos:", user);

          // 4. Retorna dados para salvar na sessão JWT
          return {
            id: user.id,
            name: user.nome,
            email: user.email,
            empresa: user.empresa,
            role: user.funcao,
            accessToken: token,
          };
        } catch (error) {
          console.error("❌ Erro inesperado no authorize:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.empresa = user.empresa;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        empresa: token.empresa as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
};

// 👇 Exporta o handler que será usado pela rota do App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
