"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWarningById } from "../../services/get-warning-by-id";
import { updateWarning } from "../../services/update-warning";
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
import { WarningObjectResponse } from "../../interfaces/warning-interface";
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

const editWarningSchema = z.object({
  motivo: z
    .string()
    .min(1, "O motivo é obrigatório")
    .max(255, "O motivo deve ter no máximo 255 caracteres"),
  data: z.string().min(1, "A data é obrigatória"),
});

type EditWarningFormValues = z.infer<typeof editWarningSchema>;

export default function UpdateWarningPage({
  params,
}: {
  params: Promise<{ warningId: string }>;
}) {
  const { warningId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: warning } = useQuery<WarningObjectResponse>({
    queryKey: ["warning", warningId],
    queryFn: () => getWarningById(warningId),
    enabled: !!warningId,
  });

  const form = useForm<EditWarningFormValues>({
    resolver: zodResolver(editWarningSchema),
    defaultValues: {
      motivo: "",
      data: "",
    },
  });

  useEffect(() => {
    if (warning) {
      const [day, month, year] = warning.data.split("/");
      form.reset({
        motivo: warning.motivo,
        data: `${year}-${month}-${day}`,
      });
    }
  }, [warning, form]);

  const { mutateAsync: updateWarningFn, isPending } = useMutation({
    mutationFn: updateWarning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnings"] });
      toast.success("Advertência atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a advertência", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditWarningFormValues) => {
    await updateWarningFn({
      ...data,
      warningId,
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
                <BreadcrumbLink href="/ocorrencias/advertencias">
                  Advertências
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
            <Link href="/ocorrencias/advertencias">
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
              <CardTitle>Informações da Advertência</CardTitle>
              <CardDescription>
                Atualize as informações da advertência registrada
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
                      name="data"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Advertência</FormLabel>
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
                          <FormLabel>Motivo da Advertência</FormLabel>
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
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        "Atualizar Advertência"
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
