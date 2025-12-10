"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAbsenceById } from "../../services/get-absence-by-id";
import { updateAbsence } from "../../services/update-absence";
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
import { AbsencesObjectResponse } from "../../interfaces/absence-interfaces";
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

const editAbsenceSchema = z.object({
  motivo: z
    .string()
    .min(1, "O motivo é obrigatório")
    .max(255, "O motivo deve ter no máximo 255 caracteres"),
  data: z.string().min(1, "A data é obrigatória"),
});

type EditAbsenceFormValues = z.infer<typeof editAbsenceSchema>;

export default function UpdateAbsencePage({
  params,
}: {
  params: Promise<{ absenceId: string }>;
}) {
  const { absenceId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: absence } = useQuery<AbsencesObjectResponse>({
    queryKey: ["absence", absenceId],
    queryFn: () => getAbsenceById(absenceId),
    enabled: !!absenceId,
  });

  const form = useForm<EditAbsenceFormValues>({
    resolver: zodResolver(editAbsenceSchema),
    defaultValues: {
      motivo: "",
      data: "",
    },
  });

  useEffect(() => {
    if (absence) {
      const [day, month, year] = absence.data.split("/");
      form.reset({
        motivo: absence.motivo,
        data: `${year}-${month}-${day}`,
      });
    }
  }, [absence, form]);

  const { mutateAsync: updateAbsenceFn, isPending } = useMutation({
    mutationFn: updateAbsence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["absences"] });
      toast.success("Falta atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a falta", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditAbsenceFormValues) => {
    await updateAbsenceFn({
      ...data,
      absenceId,
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
                <BreadcrumbLink href="/ocorrencias/faltas">
                  Faltas
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
            <Link href="/ocorrencias/faltas">
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
              <CardTitle>Informações da Falta</CardTitle>
              <CardDescription>
                Atualize as informações da falta registrada
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
                        <FormLabel>Data da Falta</FormLabel>
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
                    name="motivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo da Falta</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Atraso, consulta, etc."
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
                        "Atualizar Falta"
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
