"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEPI } from "@/app/(private)/empresas/epis/services/create-epi";
import type { EpiData } from "@/app/(private)/empresas/epis/services/epi-interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const createEpiSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  descricao: z.string().min(5, {
    message: "A descrição deve ter pelo menos 5 caracteres.",
  }),
  equipamentos: z.string().min(5, {
    message: "Os equipamentos devem ter pelo menos 5 caracteres.",
  }),
});

type CreateEpiFormValues = z.infer<typeof createEpiSchema>;

export default function CreateEpiDialog() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const empresa = session?.user.empresa;
  const token = session?.accessToken;
  const router = useRouter();

  const form = useForm<CreateEpiFormValues>({
    resolver: zodResolver(createEpiSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      equipamentos: "",
    },
  });

  const createEPIMutation = useMutation({
    mutationFn: (data: EpiData) => createEPI(data, empresa!, token!),
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

  const handleClose = () => {
    form.reset();
    router.back();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo EPI</DialogTitle>
          <DialogDescription>
            Preencha as informações para adicionar um novo EPI ao sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do EPI</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Kit de Proteção Básico"
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
                      placeholder="Descrição detalhada do kit de EPI e sua finalidade"
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
                      placeholder="Capacete, Luvas, Óculos, etc"
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
                onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  );
}
