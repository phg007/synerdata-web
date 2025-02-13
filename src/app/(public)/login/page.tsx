"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual authentication logic
    console.log("Login attempt:", { username, password });
    // For now, we'll just redirect to the dashboard
    router.push("/dashboard");
  };

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
              src="/placeholder.svg?height=60&width=240"
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
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
            Não tem uma conta?{" "}
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
