"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Shield } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { createEPI } from "../services/create-epi";
import { toast } from "sonner";
import Link from "next/link";

const createEpiSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  descricao: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres."),
  equipamentos: z
    .string()
    .min(5, "Os equipamentos devem ter pelo menos 5 caracteres."),
});

type CreateEpiFormValues = z.infer<typeof createEpiSchema>;

export default function CreateEpi() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const form = useForm<CreateEpiFormValues>({
    resolver: zodResolver(createEpiSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      equipamentos: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: createEPIFn, isPending } = useMutation({
    mutationFn: createEPI,
    onSuccess: () => {
      toast.success("Epi cadastrada com sucesso");
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Erro ao criar EPI:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreateEpiFormValues) => {
    await createEPIFn({
      ...data,
      empresaId: companyId!,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/empresas/epis"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para epis
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nova Epis</h1>
              <p className="text-gray-600">
                Cadastre um novo epis para sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo EPI</CardTitle>
            <CardDescription>
              Preencha as informações para adicionar um novo EPI ao sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do EPI</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipamentos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipamentos Inclusos</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Epis"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
