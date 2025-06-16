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
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createAccident } from "../services/create-accident";
import { toast } from "sonner";
import Link from "next/link";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EmployeeObjectResponse,
  getEmployeesByCompany,
} from "../services/get-employees-by-company";

const createAccidentSchema = z.object({
  descricao: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(255, "A descrição deve ter no máximo 255 caracteres"),
  data: z.string().min(1, "A data é obrigatória"),
  natureza: z
    .string()
    .min(1, "A natureza é obrigatória")
    .max(255, "A natureza deve ter no máximo 255 caracteres"),
  cat: z.string().optional(),
  medidasTomadas: z
    .string()
    .min(1, "As medidas tomadas são obrigatórias")
    .max(255, "As medidas tomadas devem ter no máximo 255 caracteres"),
  funcionarioId: z
    .string()
    .min(1, "Selecione o funcionário envolvido no acidente"),
});

type CreateAccidentFormValues = z.infer<typeof createAccidentSchema>;

export default function CreateAccident() {
  const router = useRouter();
  const { data: session } = useSession();
  const companyId = session?.user.empresa;
  // const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId!),
    enabled: !!companyId,
  });

  const form = useForm<CreateAccidentFormValues>({
    resolver: zodResolver(createAccidentSchema),
    defaultValues: {
      descricao: "",
      data: "",
      natureza: "",
      cat: "",
      medidasTomadas: "",
      funcionarioId: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: createAccidentFn, isPending } = useMutation({
    mutationFn: createAccident,
    onSuccess: () => {
      toast.success("Acidente  cadastrada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      console.error("Erro ao criar Acidente :", error);
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: CreateAccidentFormValues) => {
    const isoData = new Date(data.data).toISOString();

    await createAccidentFn({
      ...data,
      data: isoData,
      funcionarioId: data.funcionarioId,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/acidentes"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Acidentes
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Novo Acidente
              </h1>
              <p className="text-gray-600">
                Cadastre um novo Acidente para sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo Acidente</CardTitle>
            <CardDescription>
              Cadastre um novo Acidente para sua empresa
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
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Acidente</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            placeholder="Selecione a data"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do CAT</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 123456789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="natureza"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Natureza do Acidente</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Queda, Corte, Queimadura, etc."
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
                      <FormLabel>Descrição do Acidente</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Descreva detalhadamente como o acidente ocorreu..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medidasTomadas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medidas Tomadas</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Descreva as medidas tomadas após o acidente..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Acidente"
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
