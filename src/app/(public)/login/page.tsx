"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    const response = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (response?.error) {
      toast.error("E-mail ou senha inválidos");
      return;
    }

    if (response?.ok) {
      toast.success("Usuário autenticado", {
        description: "Você será redirecionado para a página inicial.",
      });

      const session = await getSession();

      if (session?.user?.primeiroAcesso && session?.user?.funcao === "ADMIN") {
        router.replace("/finalizar-cadastro");
      } else {
        if (session?.user?.funcao === "SUPER_ADMIN") {
          router.replace("/admin/empresas");
        } else {
          router.replace("/relatorio");
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/logosynerdata.png"
              alt="Synerdata Logo"
              width={240}
              height={60}
              className="dark:invert"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Digite com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Digite sua senha"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!form.formState.isSubmitting ? (
                <Button className="w-full" type="submit">
                  <span className="">Entrar</span>
                </Button>
              ) : (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="">Carregando</span>
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <span className="text-sm">
            Esqueceu sua senha?{" "}
            <Link
              href="/recuperar-senha"
              className="hover:underline mt-2 text-blue-600"
            >
              Clique aqui.
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
