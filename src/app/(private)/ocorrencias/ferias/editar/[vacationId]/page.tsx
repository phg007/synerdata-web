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
import { ArrowLeft, Loader2, Palmtree } from "lucide-react";
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
import { getVacationById } from "../../services/get-vacations-by-id";

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
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/ferias"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Férias
          </Link>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Palmtree className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Férias
              </h1>
              <p className="text-gray-600">
                Atualize os dados das férias do funcionário
              </p>
            </div>
          </div>
        </div>

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
  );
}
