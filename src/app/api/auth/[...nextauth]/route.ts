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

          console.log("Body da requisição:", bodyData);
          const response = await fetch(
            "http://host.docker.internal:3000/api/auth/sign-in",
            {
              method: "POST",
              body: bodyData,

              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(`retorno  ${response.status}`);
          console.log(`retorno  ${credentials.email}`);
          console.log(`retorno  ${credentials.password}`);

          if (response.status !== 200) return null;
          const authData = await response.json();

          console.log(authData.data);

          if (!authData.data.access_token) return null;

          (await cookies()).set("jwt", authData.jwt);

          return {
            id: "1",
            // email:"paulo.henriqueicm2011@gmail.com", //authData.user.email,
            // name:"PAULO", //authData.user.name,
          };

          // return { token: authData.data.access_token, email: credentials.email };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
