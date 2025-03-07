"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "CredentialsSignin") {
      toast("Erro de Login", {
        description: "Usuário ou senha incorretos.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  }, [error]);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    await signIn("credentials", {
      ...data,
      callbackUrl: "/dashboard",
    });
  }

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 inline-flex items-center text-black hover:text-black/80"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Synerdata
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.jpeg?height=60&width=240"
              alt="Synerdata Logo"
              width={240}
              height={60}
              className="dark:invert"
            />
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={login}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Usuário</Label>
                <Input
                  name="email"
                  id="email"
                  placeholder="Seu nome de usuário"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Toaster />
            <Button
              className="w-full mt-6 bg-black text-white hover:bg-black/90"
              type="submit"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mt-2">
            Não tem uma conta?{"CredentialsSignin"}
            <Link
              href="/solicitar-demonstracao"
              className="text-black hover:underline"
            >
              Solicite uma demonstração
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
