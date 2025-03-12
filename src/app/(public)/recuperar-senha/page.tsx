"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
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
import { AlertCircle, CheckCircle } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitted(false);

    try {
      // Here you would implement the actual password recovery logic
      // For now, we'll just simulate a successful submission
      console.log("Password recovery requested for:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsSubmitted(true);
    } catch (err) {
      setError(
        `Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.${err}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <Link
        href="/sign-in"
        className="absolute top-4 left-4 inline-flex items-center text-black hover:text-black/80"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Login
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-center">
            Digite seu e-mail para receber instruções de recuperação de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Um e-mail com instruções para redefinir sua senha foi enviado
                para {email}.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                  role="alert"
                >
                  <span className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </span>
                </div>
              )}
              <Button
                className="w-full mt-6 bg-black text-white hover:bg-black/90"
                type="submit"
              >
                Enviar Instruções
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/sign-in"
            className="text-sm text-purple-600 hover:underline"
          >
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
