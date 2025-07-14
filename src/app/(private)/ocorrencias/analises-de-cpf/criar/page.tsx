"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Fingerprint, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { createCpfAnalysis } from "../services/create-cpf-Analysis";
import {
  getEmployeesByCompany,
  EmployeeObjectResponse,
} from "../services/get-employees-by-company";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  funcionarioId: z
    .string({ required_error: "Selecione o funcionário" })
    .min(1, "Selecione o funcionário"),
  descricao: z
    .string({ required_error: "Informe a descrição da análise" })
    .min(1, "A descrição é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateCpfAnalysisPage() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa ?? "";

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId),
    enabled: Boolean(companyId),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      funcionarioId: "",
      descricao: "",
    },
    mode: "onChange",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCpfAnalysis,
    onSuccess: () => {
      toast.success("Análise cadastrada com sucesso");
      form.reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Link
            href="/ocorrencias/analises-de-cpf"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Análises
          </Link>
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Fingerprint className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Nova Análise de CPF
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Análise</CardTitle>
            <CardDescription>
              Selecione o funcionário e informe a descrição da análise
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => mutateAsync(data))}
                className="space-y-6"
              >
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
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Descrição <span className="text-red-500">*</span>
                      </FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Informe a descrição da análise"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end border-t pt-6">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Análise"
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
