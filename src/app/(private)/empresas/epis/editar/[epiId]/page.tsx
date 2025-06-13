"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEPIById } from "../../services/get-epi-by-id";
import { updateEPI } from "../../services/update-epi";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { EpiObjectResponse } from "../../interfaces/epi-interfaces";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

const editEpiSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  descricao: z
    .string()
    .min(5, { message: "A descrição deve ter pelo menos 5 caracteres." }),
  equipamentos: z
    .string()
    .min(5, { message: "Os equipamentos devem ter pelo menos 5 caracteres." }),
});

type EditEpiFormValues = z.infer<typeof editEpiSchema>;

export default function UpdateEpiPage({
  params,
}: {
  params: Promise<{ epiId: string }>;
}) {
  const { epiId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: epi } = useQuery<EpiObjectResponse>({
    queryKey: ["epi", epiId],
    queryFn: () => getEPIById(epiId),
    enabled: !!epiId,
  });

  const form = useForm<EditEpiFormValues>({
    resolver: zodResolver(editEpiSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      equipamentos: "",
    },
  });

  useEffect(() => {
    if (epi) {
      form.reset({
        nome: epi.nome,
        descricao: epi.descricao,
        equipamentos: epi.equipamentos,
      });
    }
  }, [epi, form]);

  const { mutateAsync: updateEPIFn, isPending } = useMutation({
    mutationFn: updateEPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epis"] });
      toast.success("Epi atualizado com sucesso");

      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar o Epi", {
        description: error.message,
      });
    },
  });
  console.log(`epiId${epiId}`);
  const onSubmit = async (data: EditEpiFormValues) => {
    await updateEPIFn({
      ...data,
      epiId,
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
            Voltar para filiais
          </Link>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Epi</h1>
              <p className="text-gray-600">
                Atualize os dados de uma Epi da sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Epi</CardTitle>
            <CardDescription>
              Preencha os campos que deseja atualizar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                        <Input
                          placeholder="Ex: Kit de Proteção Básico"
                          {...field}
                          disabled={isPending}
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
                          disabled={isPending}
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
                          placeholder="Liste os equipamentos inclusos no kit (ex: Capacete, Luvas de Segurança, Óculos de Proteção)"
                          {...field}
                          disabled={isPending}
                          rows={4}
                        />
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
                        Atualizando...
                      </>
                    ) : (
                      "Atualizar Epi"
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
