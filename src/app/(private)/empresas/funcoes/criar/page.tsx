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
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRole } from "../services/create-role";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { EpiObjectResponse } from "../../epis/interfaces/epi-interfaces";
import { getEPIsByCompany } from "../../epis/services/get-epis-by-company";
import { MultiSelect } from "@/components/ui/multi-select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <span className="text-muted-foreground">Empresa</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/empresas/funcoes">
                  Funções
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Criar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/empresas/funcoes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4 pt-0">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Função</CardTitle>
              <CardDescription>
                Preencha todos os campos obrigatórios para cadastrar a nova
                função
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
                              <Input
                                placeholder="Ex: Recepcionista"
                                {...field}
                              />
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
    </div>
  );
}
