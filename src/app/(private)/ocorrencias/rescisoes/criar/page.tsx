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
import { ArrowLeft, Loader2, UserX } from "lucide-react";
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
import { createTermination } from "../services/create-termination";
import { Textarea } from "@/components/ui/textarea";

const createTerminationSchema = z.object({
  data: z.string().min(1, "A data de demissão é obrigatória"),

  motivoInterno: z
    .string()
    .min(1, "O motivo interno é obrigatório")
    .max(255, "O motivo interno deve ter no máximo 255 caracteres"),

  motivoTrabalhista: z
    .string()
    .min(1, "O motivo trabalhista é obrigatório")
    .max(255, "O motivo trabalhista deve ter no máximo 255 caracteres"),

  acaoTrabalhista: z
    .string()
    .min(1, "A ação trabalhista é obrigatória")
    .max(255, "A ação trabalhista deve ter no máximo 255 caracteres"),

  formaDemissao: z
    .string()
    .min(1, "A forma de demissão é obrigatória")
    .max(255, "A forma de demissão deve ter no máximo 255 caracteres"),

  funcionarioId: z.string().min(1, "Selecione o funcionário"),
});

type CreateTerminationFormValues = z.infer<typeof createTerminationSchema>;

export default function CreateTerminationPage() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId!),
    enabled: !!companyId,
  });

  const defaultValues: CreateTerminationFormValues = {
    data: "",
    motivoInterno: "",
    motivoTrabalhista: "",
    acaoTrabalhista: "",
    formaDemissao: "",
    funcionarioId: "",
  };

  const form = useForm<CreateTerminationFormValues>({
    resolver: zodResolver(createTerminationSchema),
    defaultValues,
    mode: "onChange",
  });

  const { mutateAsync: createTerminationFn, isPending } = useMutation({
    mutationFn: createTermination,
    onSuccess: () => {
      toast.success("Rescisão cadastrada com sucesso");
      form.reset(defaultValues); // Limpa o formulário
    },
    onError: (error: Error) => {
      console.error("Erro ao cadastrar rescisão:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreateTerminationFormValues) => {
    await createTerminationFn(data);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/rescisoes"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Rescisões
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserX className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nova Rescisão
              </h1>
              <p className="text-gray-600">
                Cadastre uma nova rescisão de funcionário
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Rescisão</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar uma rescisão
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
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data da Demissão{" "}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="motivoInterno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Motivo Interno <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Ex: performance" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motivoTrabalhista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Motivo Trabalhista{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Ex: acordo mútuo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="acaoTrabalhista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Ação Trabalhista{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="formaDemissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Forma de Demissão{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: sem justa causa" />
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
                      "Cadastrar Rescisão"
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
