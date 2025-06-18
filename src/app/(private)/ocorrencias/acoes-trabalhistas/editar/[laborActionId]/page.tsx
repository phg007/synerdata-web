"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLaborActionById } from "../../services/get-labor-action-by-id";
import { updateLaborAction } from "../../services/update-labor-action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, Loader2, Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LaborActionObjectResponse } from "../../interfaces/labor-action";
const preprocessStr = () =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());
const editLaborActionSchema = z.object({
  numeroProcesso: z.string().min(1, "Número do processo é obrigatório"),
  tribunal: z.string().min(1, "Tribunal é obrigatório"),
  dataAjuizamento: z.string().min(1, "Data do ajuizamento é obrigatória"),
  reclamante: z.string().min(1, "Reclamante é obrigatório"),
  reclamado: z.string().min(1, "Reclamado é obrigatório"),

  advogadoReclamante: z.string().optional(),
  advogadoReclamado: z.string().optional(),

  descricao: z.string().min(1, "Descrição é obrigatória"),
  valorCausa: z.coerce.number().optional(),

  andamento: z.string().optional(),
  decisao: z.string().optional(),
  recursos: z.string().optional(),

  dataConclusao: preprocessStr(),
  custasDespesas: z.coerce.number().optional(),

  dataConhecimento: z.string().min(1, "Data de conhecimento é obrigatória"),
});

type EditLaborActionFormValues = z.infer<typeof editLaborActionSchema>;

export default function UpdateLaborActionPage({
  params,
}: {
  params: Promise<{ laborActionId: string }>;
}) {
  const { laborActionId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: action } = useQuery<LaborActionObjectResponse>({
    queryKey: ["labor-action", laborActionId],
    queryFn: () => getLaborActionById(laborActionId),
    enabled: !!laborActionId,
  });

  const form = useForm<EditLaborActionFormValues>({
    resolver: zodResolver(editLaborActionSchema),
    defaultValues: {
      numeroProcesso: "",
      tribunal: "",
      dataAjuizamento: "",
      reclamante: "",
      reclamado: "",
      advogadoReclamante: "",
      advogadoReclamado: "",
      descricao: "",
      valorCausa: 0,
      andamento: "",
      decisao: "",
      recursos: "",
      dataConclusao: "",
      custasDespesas: 0,
      dataConhecimento: "",
    },
  });

  useEffect(() => {
    if (!action) return;

    const formatDate = (d?: string) => {
      if (!d) return "";
      const [day, month, year] = d.split("/");
      return `${year}-${month}-${day}`;
    };

    form.reset({
      numeroProcesso: action.numeroProcesso,
      tribunal: action.tribunal,
      dataAjuizamento: formatDate(action.dataAjuizamento),
      reclamante: action.reclamante,
      reclamado: action.reclamado,
      advogadoReclamante: action.advogadoReclamante ?? "",
      advogadoReclamado: action.advogadoReclamado ?? "",
      descricao: action.descricao,
      valorCausa: action.valorCausa,
      andamento: action.andamento ?? "",
      decisao: action.decisao ?? "",
      recursos: action.recursos ?? "",
      dataConclusao: formatDate(action.dataConclusao),
      custasDespesas: action.custasDespesas,
      dataConhecimento: formatDate(action.dataConhecimento),
    });
  }, [action, form]);

  const { mutateAsync: updateLaborActionFn, isPending } = useMutation({
    mutationFn: updateLaborAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labor-actions"] });
      toast.success("Ação trabalhista atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a ação", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditLaborActionFormValues) => {
    await updateLaborActionFn({
      ...data,
      laborActionId,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/acoes-trabalhistas"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Ações
          </Link>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Ação Trabalhista
              </h1>
              <p className="text-gray-600">
                Atualize os dados da ação trabalhista registrada
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Ação</CardTitle>
            <CardDescription>
              Edite os campos necessários e clique em&nbsp;
              <strong>Atualizar Ação</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Grupo 1 – Processo */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="numeroProcesso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº do Processo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tribunal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tribunal / Vara</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataAjuizamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Ajuizamento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataConhecimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Conhecimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Grupo 2 – Partes */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="reclamante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reclamante</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reclamado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reclamado</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Grupo 3 – Advogados (opcionais) */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="advogadoReclamante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advogado (Reclamante)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="advogadoReclamado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advogado (Reclamado)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Grupo 4 – Valores & Custas */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="valorCausa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor da Causa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="custasDespesas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custas / Despesas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Grupo 5 – Andamento */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="andamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Andamento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="decisao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decisão / Sentença</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recursos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recursos</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataConclusao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Conclusão</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Descrição (campo grande) */}
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      "Atualizar Ação"
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
