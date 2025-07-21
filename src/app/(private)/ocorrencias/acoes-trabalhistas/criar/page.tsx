"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Scale } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  EmployeeObjectResponse,
  getEmployeesByCompany,
} from "../services/get-employees-by-company";
import { createLaborAction } from "../services/create-labor-action";

const createLaborActionSchema = z.object({
  funcionarioId: z.string().min(1, "Selecione o funcionário"),
  numeroProcesso: z.string().min(1, "O número do processo é obrigatório"),
  tribunal: z.string().min(1, "O tribunal é obrigatório"),
  dataAjuizamento: z.string().min(1, "A data do ajuizamento é obrigatória"),
  reclamante: z.string().min(1, "O nome do reclamante é obrigatório"),
  reclamado: z.string().min(1, "O nome do reclamado é obrigatório"),
  advogadoReclamante: z.string().optional(),
  advogadoReclamado: z.string().optional(),
  descricao: z.string().min(1, "A descrição é obrigatória"),
  valorCausa: z.coerce.number().optional(),
  andamento: z.string().optional(),
  decisao: z.string().optional(),
  dataConclusao: z.string().optional(),
  recursos: z.string().optional(),
  custasDespesas: z.coerce.number().optional(),
  dataConhecimento: z.string().min(1, "A data de conhecimento é obrigatória"),
});

type CreateLaborActionFormValues = z.infer<typeof createLaborActionSchema>;

export default function CreateLaborActionPage() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId!),
    enabled: !!companyId,
  });

  const defaultValues: CreateLaborActionFormValues = {
    funcionarioId: "",
    numeroProcesso: "",
    tribunal: "",
    dataAjuizamento: "",
    reclamante: "",
    reclamado: "",
    advogadoReclamante: undefined,
    advogadoReclamado: undefined,
    descricao: "",
    valorCausa: 0,
    andamento: undefined,
    decisao: undefined,
    dataConclusao: undefined,
    recursos: undefined,
    custasDespesas: 0,
    dataConhecimento: "",
  };

  const form = useForm<CreateLaborActionFormValues>({
    resolver: zodResolver(createLaborActionSchema),
    defaultValues,
    mode: "onChange",
  });

  const { mutateAsync: createLaborActionFn, isPending } = useMutation({
    mutationFn: createLaborAction,
    onSuccess: () => {
      toast.success("Ação trabalhista cadastrada com sucesso");
      form.reset(defaultValues);
    },
    onError: (error: Error) => {
      console.error("Erro ao cadastrar ação trabalhista:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreateLaborActionFormValues) => {
    await createLaborActionFn(data);
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
            Voltar para Ações Trabalhistas
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nova Ação Trabalhista
              </h1>
              <p className="text-gray-600">
                Cadastre uma nova ação trabalhista
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Ação</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar a ação trabalhista
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="funcionarioId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Funcionário <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o funcionário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numeroProcesso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Número do Processo{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Tribunal <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Data do Ajuizamento{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reclamante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Reclamante <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Reclamado <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="valorCausa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor da Causa (R$)</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="custasDespesas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custas/Despesas (R$)</FormLabel>
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
                        <FormLabel>Decisão/Sentença</FormLabel>
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
                    name="descricao"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          Descrição <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>
                          Data do Conhecimento{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Ação"
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
