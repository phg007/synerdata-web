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
import { ArrowLeft, CircleAlert, Loader2 } from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createWarning } from "../services/create-warning";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeObjectResponse } from "@/app/(private)/funcionarios/interfaces/employee-interface";
import { getEmployeesByCompany } from "@/app/(private)/funcionarios/services/get-employees-by-company";

const createWarningSchema = z.object({
  data: z.string().min(1, "A data é obrigatória"),
  motivo: z
    .string()
    .min(1, "O motivo é obrigatório")
    .max(255, "O motivo deve ter no máximo 255 caracteres"),
  funcionarioId: z.string().min(1, "Selecione o funcionário"),
});

type CreateWarningFormValues = z.infer<typeof createWarningSchema>;

export default function CreateWarning() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId!),
    enabled: !!companyId,
  });

  const form = useForm<CreateWarningFormValues>({
    resolver: zodResolver(createWarningSchema),
    defaultValues: {
      funcionarioId: "",
      data: "",
      motivo: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: createWarningFn, isPending } = useMutation({
    mutationFn: createWarning,
    onSuccess: () => {
      toast.success("Advertência cadastrada com sucesso");
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Erro ao cadastrar advertência:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreateWarningFormValues) => {
    const isoDate = new Date(data.data).toISOString();
    await createWarningFn({
      ...data,
      data: isoDate,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/advertencias"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Advertências
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CircleAlert className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nova Advertência
              </h1>
              <p className="text-gray-600">
                Cadastre uma nova advertência para o funcionário
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova Advertência</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios para cadastrar uma nova
              Advertência
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
                          Data da Advertência{" "}
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

                <FormField
                  control={form.control}
                  name="motivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Motivo da Advertência{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Atraso, advertência justificada, etc."
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
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Advertência"
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
