import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const loginRes = await fetch(
            "http://host.docker.internal:3001/api/v1/auth/sign-in",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                senha: credentials.password,
              }),
            }
          );

          if (!loginRes.ok) return null;

          const loginData = await loginRes.json();
          const accessToken = loginData.data.access_token;

          if (!accessToken) return null;

          const profileRes = await fetch(
            "http://host.docker.internal:3001/api/v1/usuarios/perfil",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!profileRes.ok) return null;

          const profile = await profileRes.json();

          return {
            id: profile.id,
            name: profile.nome,
            email: profile.email,
            empresa: profile.empresa,
            funcao: profile.funcao,
            accessToken,
          };
        } catch (error) {
          console.error("Erro no authorize:", error);
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
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.funcao = token.funcao as string;
      session.user.empresa = token.empresa as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
