"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { updateVacation } from "../../services/update-vacation";
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
import { VacationObjectResponse } from "../../interfaces/vacation-interfaces";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVacationById } from "../../services/get-vacation-by-id";
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

const editVacationSchema = z.object({
  dataInicio: z.string().min(1, "A data de início é obrigatória"),
  dataFim: z.string().min(1, "A data de encerramento é obrigatória"),
});

type EditVacationFormValues = z.infer<typeof editVacationSchema>;

export default function UpdateVacationPage({
  params,
}: {
  params: Promise<{ vacationId: string }>;
}) {
  const { vacationId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: vacation } = useQuery<VacationObjectResponse>({
    queryKey: ["vacation", vacationId],
    queryFn: () => getVacationById(vacationId),
    enabled: !!vacationId,
  });

  const form = useForm<EditVacationFormValues>({
    resolver: zodResolver(editVacationSchema),
    defaultValues: {
      dataInicio: "",
      dataFim: "",
    },
  });

  useEffect(() => {
    if (vacation) {
      const [diaInicio, mesInicio, anoInicio] = vacation.dataInicio.split("/");
      const [diaFim, mesFim, anoFim] = vacation.dataFim.split("/");
      form.reset({
        dataInicio: `${anoInicio}-${mesInicio}-${diaInicio}`,
        dataFim: `${anoFim}-${mesFim}-${diaFim}`,
      });
    }
  }, [vacation, form]);

  const { mutateAsync: updateVacationFn, isPending } = useMutation({
    mutationFn: updateVacation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacations"] });
      toast.success("Férias atualizadas com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar as férias", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditVacationFormValues) => {
    await updateVacationFn({
      ...data,
      vacationId,
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
                <BreadcrumbLink href="/ocorrencias/ferias">
                  Férias
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
            <Link href="/ocorrencias/ferias">
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
              <CardTitle>Informações das Férias</CardTitle>
              <CardDescription>
                Atualize as informações das férias registradas
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
                        <FormLabel>Data de Encerramento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        "Atualizar Férias"
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
