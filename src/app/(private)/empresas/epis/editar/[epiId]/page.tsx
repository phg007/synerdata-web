"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEPIById } from "../../services/get-epi-by-id";
import { updateEPI } from "../../services/update-epi";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { EpiObjectResponse } from "../../interfaces/epi-interfaces";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const editEpiSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  descricao: z
    .string()
    .min(5, { message: "A descrição deve ter pelo menos 5 caracteres." }),
  equipamentos: z
    .string()
    .min(5, { message: "Os equipamentos devem ter pelo menos 5 caracteres." }),
});

type EditEpiFormValues = z.infer<typeof editEpiSchema>;

export default function UpdateEpiPage({
  params,
}: {
  params: Promise<{ epiId: string }>;
}) {
  const { epiId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: epi, isLoading } = useQuery<EpiObjectResponse>({
    queryKey: ["epi", epiId],
    queryFn: () => getEPIById(epiId),
    enabled: !!epiId,
  });

  const form = useForm<EditEpiFormValues>({
    resolver: zodResolver(editEpiSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      equipamentos: "",
    },
  });

  useEffect(() => {
    if (epi) {
      form.reset({
        nome: epi.nome,
        descricao: epi.descricao,
        equipamentos: epi.equipamentos,
      });
    }
  }, [epi, form]);

  const { mutateAsync: updateEPIFn, isPending } = useMutation({
    mutationFn: updateEPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epis"] });
      toast.success("Epi atualizado com sucesso");

      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar o Epi", {
        description: error.message,
      });
    },
  });
  const onSubmit = async (data: EditEpiFormValues) => {
    await updateEPIFn({
      ...data,
      epiId,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/empresas/epis">EPIs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Editar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="text-slate-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/empresas/epis">EPIs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/empresas/epis">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 pt-0">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Informações do EPI</CardTitle>
              <CardDescription>
                Preencha os campos que deseja atualizar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome do EPI <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Kit de Proteção Básico"
                            {...field}
                            disabled={isPending}
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
                            placeholder="Descrição detalhada do kit de EPI e sua finalidade"
                            {...field}
                            disabled={isPending}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="equipamentos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Equipamentos Inclusos{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Liste os equipamentos inclusos no kit (ex: Capacete, Luvas de Segurança, Óculos de Proteção)"
                            {...field}
                            disabled={isPending}
                            rows={4}
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
                          Atualizando...
                        </>
                      ) : (
                        "Atualizar EPI"
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
