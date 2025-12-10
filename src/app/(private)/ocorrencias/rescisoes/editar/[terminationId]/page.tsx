"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTerminationById } from "../../services/get-termination-by-id";
import { updateTermination } from "../../services/update-termination";
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
import { TerminationObjectResponse } from "../../interfaces/termination-interfaces";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const editTerminationSchema = z.object({
  data: z.string().min(1, "A data de demissão é obrigatória"),
  motivoInterno: z
    .string()
    .min(1, "O motivo interno é obrigatório")
    .max(255, "Máximo de 255 caracteres"),
  motivoTrabalhista: z
    .string()
    .min(1, "O motivo trabalhista é obrigatório")
    .max(255),
  acaoTrabalhista: z
    .string()
    .min(1, "A ação trabalhista é obrigatória")
    .max(255),
  formaDemissao: z
    .string()
    .min(1, "A forma de demissão é obrigatória")
    .max(255),
});

type EditTerminationFormValues = z.infer<typeof editTerminationSchema>;

export default function UpdateTerminationPage({
  params,
}: {
  params: Promise<{ terminationId: string }>;
}) {
  const { terminationId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: termination } = useQuery<TerminationObjectResponse>({
    queryKey: ["termination", terminationId],
    queryFn: () => getTerminationById(terminationId),
    enabled: !!terminationId,
  });

  const form = useForm<EditTerminationFormValues>({
    resolver: zodResolver(editTerminationSchema),
    defaultValues: {
      data: "",
      motivoInterno: "",
      motivoTrabalhista: "",
      acaoTrabalhista: "",
      formaDemissao: "",
    },
  });

  useEffect(() => {
    if (termination) {
      const [day, month, year] = termination.data.split("/");
      form.reset({
        data: `${year}-${month}-${day}`,
        motivoInterno: termination.motivoInterno,
        motivoTrabalhista: termination.motivoTrabalhista,
        acaoTrabalhista: termination.acaoTrabalhista,
        formaDemissao: termination.formaDemissao,
      });
    }
  }, [termination, form]);

  const { mutateAsync: updateTerminationFn, isPending } = useMutation({
    mutationFn: updateTermination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terminations"] });
      toast.success("Rescisão atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a rescisão", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditTerminationFormValues) => {
    await updateTerminationFn({
      ...data,
      terminationId,
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
                <span className="text-muted-foreground">Ocorrências</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/ocorrencias/rescisoes">
                  Rescisões
                </BreadcrumbLink>
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
            <Link href="/ocorrencias/rescisoes">
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
              <CardTitle>Informações da Rescisão</CardTitle>
              <CardDescription>
                Atualize as informações da rescisão registrada
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Demissão</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motivoInterno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo Interno</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
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
                        <FormLabel>Motivo Trabalhista</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acaoTrabalhista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ação Trabalhista</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Forma de Demissão</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        "Atualizar Rescisão"
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
