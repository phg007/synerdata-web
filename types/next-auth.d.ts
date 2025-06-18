import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      empresa: string;
      funcao: string;
      primeiroAcesso: boolean;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    empresa: string;
    funcao: string;
    primeiroAcesso: boolean;
    accessToken: string;
  }
}
