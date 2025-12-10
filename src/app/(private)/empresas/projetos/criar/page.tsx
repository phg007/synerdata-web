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
import { useMutation } from "@tanstack/react-query";
import { createProject } from "../services/create-project";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
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
  descricao: z.string().min(1, "Descrição é obrigatória"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  cno: z
    .string()
    .min(12, "CNO deve conter 12 caracteres")
    .max(12, "CNO deve conter 12 caracteres"),
});

type CreateProjectFormData = z.infer<typeof formSchema>;

export default function CreateProjectPage() {
  const { data: session } = useSession();

  const companyId = session?.user.empresa;

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      dataInicio: "",
      cno: "",
    },
  });

  const { mutateAsync: createProjectFn, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Projeto cadastrado com sucesso");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error("Erro ao cadastrar o projeto", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    await createProjectFn({
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
                <BreadcrumbLink href="/empresas/projetos">
                  Projetos
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
            <Link href="/empresas/projetos">
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
              <CardTitle>Informações do Projeto</CardTitle>
              <CardDescription>
                Preencha todos os campos obrigatórios para cadastrar o novo
                projeto
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
                              Nome do Projeto{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: Construção Sede XYZ"
                                {...field}
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
                            <FormLabel>
                              Descrição <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Resumo do projeto"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dataInicio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Data de Início{" "}
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
                        name="cno"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Número do CNO{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="000000000000" {...field} />
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
                        "Cadastrar Projeto"
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
