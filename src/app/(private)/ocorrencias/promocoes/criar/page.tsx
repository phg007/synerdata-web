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
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
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
import { createPromotion } from "../services/create-promotion";
import {
  getRolesByCompany,
  RoleObjectResponse,
} from "../services/get-roles-by-company";

const createPromotionSchema = z.object({
  data: z.string().min(1, "A data da promoção é obrigatória"),
  salario: z.coerce
    .number({
      required_error: "O salário é obrigatório",
      invalid_type_error: "Informe um salário válido",
    })
    .min(1, "O salário deve ser maior que R$ 1,00"),
  funcaoId: z.string().min(1, "Selecione a nova função"),
  funcionarioId: z.string().min(1, "Selecione o funcionário"),
});

type CreatePromotionFormValues = z.infer<typeof createPromotionSchema>;

export default function CreatePromotionPage() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId!),
    enabled: !!companyId,
  });

  const { data: roles = [] } = useQuery<RoleObjectResponse[]>({
    queryKey: ["roles", companyId],
    queryFn: () => getRolesByCompany(companyId!),
    enabled: !!companyId,
  });

  const defaultValues: CreatePromotionFormValues = {
    data: "",
    salario: 0,
    funcaoId: "",
    funcionarioId: "",
  };

  const form = useForm<CreatePromotionFormValues>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues,
    mode: "onChange",
  });

  const { mutateAsync: createPromotionFn, isPending } = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      toast.success("Promoção cadastrada com sucesso");
      form.reset(defaultValues);
    },
    onError: (error: Error) => {
      console.error("Erro ao cadastrar promoção:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreatePromotionFormValues) => {
    await createPromotionFn(data);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/promocoes"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Promoções
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6  text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nova Promoção
              </h1>
              <p className="text-gray-600">
                Cadastre uma nova promoção de funcionário
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Promoção</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar uma promoção
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
                          Data da Promoção{" "}
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
                    name="funcaoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nova Função <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a nova função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.nome}
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
                    name="salario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Novo Salário <span className="text-red-500">*</span>
                        </FormLabel>
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

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Promoção"
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
