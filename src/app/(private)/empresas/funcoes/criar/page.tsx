"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UserCog, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRole } from "../services/create-role";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { EpiObjectResponse } from "../../epis/interfaces/epi-interfaces";
import { getEPIsByCompany } from "../../epis/services/get-epis-by-company";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  epis: z.array(z.string()).optional(),
});

type CreateRoleFormData = z.infer<typeof formSchema>;

export default function CreateRolePage() {
  const { data: session } = useSession();

  const companyId = session?.user.empresa;

  const { data: epis = [] } = useQuery<EpiObjectResponse[]>({
    queryKey: ["epis", companyId],
    queryFn: () => getEPIsByCompany(companyId!),
    enabled: !!companyId,
  });

  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      epis: [],
    },
  });

  const { mutateAsync: createRoleFn, isPending } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Função cadastrada com sucesso");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error("Erro ao cadastrar a função", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: CreateRoleFormData) => {
    await createRoleFn({
      ...data,
      empresaId: companyId!,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/empresas/funcoes"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para funções
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCog className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nova Função</h1>
              <p className="text-gray-600">
                Cadastre uma nova função para sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Função</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios para cadastrar a nova função
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome da Função{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Recepcionista" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="epis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EPIs da Função</FormLabel>
                          <FormControl>
                            <MultiSelect<EpiObjectResponse>
                              items={epis}
                              value={field.value || []}
                              onChange={field.onChange}
                              getItemValue={(epi) => epi.id}
                              getItemLabel={(epi) => epi.nome}
                              placeholder="Selecione os EPIs para esta função"
                              searchPlaceholder="Buscar EPIs..."
                              emptyMessage="Nenhum EPI encontrado."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Função"
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
