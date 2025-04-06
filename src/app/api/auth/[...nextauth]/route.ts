import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const handler = NextAuth({
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
          return null;
        }
        try {
          const bodyData = JSON.stringify({
            email: credentials.email,
            senha: credentials.password,
          });

          const response = await fetch(
            "http://host.docker.internal:3001/api/v1/auth/sign-in",
            {
              method: "POST",
              body: bodyData,

              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status !== 200) return null;
          
            const authData = await response.json();

          if (!authData.data.access_token) return null;

          (await cookies()).set("jwt", authData.data.access_token);

          return {
            id: "1",
            // email:"paulo.henriqueicm2011@gmail.com", //authData.user.email,
            // name:"PAULO", //authData.user.name,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
