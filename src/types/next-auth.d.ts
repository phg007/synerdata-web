// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    empresa: string;
    role: string;
    accessToken: string;
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      empresa: string;
      role: string;
    };
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    empresa: string;
    role: string;
    accessToken: string;
  }
}
