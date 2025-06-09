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

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { EpiData } from "../services/epi-interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEPI } from "../services";
import { toast } from "sonner";

// Schema para validação dos dados do EPI
const createEpiSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  descricao: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres."),
  equipamentos: z
    .string()
    .min(5, "Os equipamentos devem ter pelo menos 5 caracteres."),
});

type CreateEpiFormValues = z.infer<typeof createEpiSchema>;

export default function CreateEpi() {
  const router = useRouter();
  const { data: session } = useSession();
  const empresa = session?.user.empresa;

  const queryClient = useQueryClient();

  const form = useForm<CreateEpiFormValues>({
    resolver: zodResolver(createEpiSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      equipamentos: "",
    },
    mode: "onChange",
  });

  const createEPIMutation = useMutation({
    mutationFn: (data: EpiData) => createEPI(data, empresa!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["epis"] });
      toast.success(data.success);
      form.reset();
      router.back();
    },
    onError: (error) => {
      console.error("Erro ao criar EPI:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateEpiFormValues) => {
    createEPIMutation.mutate(data);
  };

  const handleCancel = () => {
    router.push("/empresas/epis");
  };

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={handleCancel}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para EPIs
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Novo EPI</h1>
          <p className="text-muted-foreground">
            informações para adicionar um novo EPI ao sistema.
          </p>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do EPI</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={createEPIMutation.isPending}
                      />
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
                      <Textarea
                        {...field}
                        disabled={createEPIMutation.isPending}
                        rows={3}
                      />
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
                      <Textarea
                        {...field}
                        disabled={createEPIMutation.isPending}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={createEPIMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createEPIMutation.isPending}>
                  {createEPIMutation.isPending ? "Criando..." : "Criar EPI"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
