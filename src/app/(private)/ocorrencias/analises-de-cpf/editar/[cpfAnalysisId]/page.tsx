"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Fingerprint, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

import { getCpfAnalysisById } from "../../services/get-cpf-Analysis-by-id";
import { updateCpfAnalysis } from "../../services/update-cpf-Analysis";
import { CpfAnalysisObjectResponse } from "../../interfaces/cpf-Analysis-interfaces";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  descricao: z
    .string({ required_error: "Informe a descrição da análise" })
    .min(1, "A descrição é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

export default function UpdateCpfAnalysisPage({
  params,
}: {
  params: Promise<{ cpfAnalysisId: string }>;
}) {
  const { data: session } = useSession();
  const { cpfAnalysisId } = use(params);
  const companyId = session?.user.empresa ?? "";

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: analysis } = useQuery<CpfAnalysisObjectResponse>({
    queryKey: ["cpf-analysis", cpfAnalysisId],
    queryFn: () => getCpfAnalysisById(cpfAnalysisId),
    enabled: !!cpfAnalysisId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      descricao: "",
    },
  });

  useEffect(() => {
    if (analysis) {
      form.reset({
        descricao: analysis.descricao,
      });
    }
  }, [analysis, form]);

  const { mutateAsync: updateCpfAnalysisFn, isPending } = useMutation({
    mutationFn: updateCpfAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cpf-analyses", companyId] });
      toast.success("Análise atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a análise", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    await updateCpfAnalysisFn({
      ...data,
      cpfAnalysisId,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Link
            href="/ocorrencias/analises-de-cpf"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Análises
          </Link>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Fingerprint className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Análise de CPF
              </h1>
              <p className="text-gray-600">
                Atualize as informações da análise registrada
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Análise</CardTitle>
            <CardDescription>
              Atualize a descrição da análise de CPF
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
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Informe a descrição da análise"
                      />
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
                      "Atualizar Análise"
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
