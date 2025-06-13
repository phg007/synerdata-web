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
import { ArrowLeft, Loader2, UserX } from "lucide-react";
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
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/rescisoes"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Rescisões
          </Link>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserX className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Rescisão
              </h1>
              <p className="text-gray-600">
                Atualize os dados da rescisão do funcionário
              </p>
            </div>
          </div>
        </div>

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
                        <Input type="date" {...field} />
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
  );
}
