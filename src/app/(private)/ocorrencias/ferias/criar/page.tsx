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
import { ArrowLeft, Loader2, Palmtree } from "lucide-react";
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
import { createVacation } from "../services/create-vacation";

const createVacationSchema = z.object({
  dataInicio: z.string().min(1, "A data de início é obrigatória"),
  dataFim: z.string().min(1, "A data de término é obrigatória"),
  funcionarioId: z.string().min(1, "Selecione o funcionário"),
});

type CreateVacationFormValues = z.infer<typeof createVacationSchema>;

export default function CreateVacationPage() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId!),
    enabled: !!companyId,
  });

  const defaultValues: CreateVacationFormValues = {
    dataInicio: "",
    dataFim: "",
    funcionarioId: "",
  };

  const form = useForm<CreateVacationFormValues>({
    resolver: zodResolver(createVacationSchema),
    defaultValues,
    mode: "onChange",
  });

  const { mutateAsync: createVacationFn, isPending } = useMutation({
    mutationFn: createVacation,
    onSuccess: () => {
      toast.success("Férias cadastradas com sucesso");
      form.reset(defaultValues);
    },
    onError: (error: Error) => {
      console.error("Erro ao cadastrar férias:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreateVacationFormValues) => {
    await createVacationFn(data);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/ferias"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Férias
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Palmtree className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nova Férias</h1>
              <p className="text-gray-600">
                Cadastre um novo período de férias
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações das Férias</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar férias
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
                        <FormLabel>Funcionário</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                    name="dataInicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataFim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Fim</FormLabel>
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
                      "Cadastrar Férias"
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
