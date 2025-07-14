"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedicalCertificateById } from "../../services/get-certificate-by-id";
import { updateMedicalCertificate } from "../../services/update-certificate";
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
import { ArrowLeft, FileTextIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { MedicalCertificateObjectResponse } from "../../interfaces/certificate-interfaces";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

const editMedicalCertificateSchema = z.object({
  motivo: z
    .string()
    .min(1, "O motivo é obrigatório")
    .max(255, "O motivo deve ter no máximo 255 caracteres"),
  dataInicio: z.string().min(1, "A data de início é obrigatória"),
  dataFim: z.string().min(1, "A data de fim é obrigatória"),
});

type EditMedicalCertificateFormValues = z.infer<
  typeof editMedicalCertificateSchema
>;

export default function UpdateMedicalCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: medicalCertificate } =
    useQuery<MedicalCertificateObjectResponse>({
      queryKey: ["medical-certificate", certificateId],
      queryFn: () => getMedicalCertificateById(certificateId),
      enabled: !!certificateId,
    });

  const form = useForm<EditMedicalCertificateFormValues>({
    resolver: zodResolver(editMedicalCertificateSchema),
    defaultValues: {
      motivo: "",
      dataInicio: "",
      dataFim: "",
    },
  });

  useEffect(() => {
    if (medicalCertificate) {
      form.reset({
        motivo: medicalCertificate.motivo,
        dataInicio: new Date(medicalCertificate.dataInicio)
          .toISOString()
          .split("T")[0],
        dataFim: new Date(medicalCertificate.dataFim)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [medicalCertificate, form]);

  const { mutateAsync: updateMedicalCertificateFn, isPending } = useMutation({
    mutationFn: updateMedicalCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-certificates"] });
      toast.success("Atestado atualizado com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar o atestado", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditMedicalCertificateFormValues) => {
    await updateMedicalCertificateFn({
      ...data,
      certificateId,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/atestados"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Atestados
          </Link>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Atestado
              </h1>
              <p className="text-gray-600">
                Atualize os dados do atestado médico registrado
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Atestado</CardTitle>
            <CardDescription>
              Atualize as informações do atestado registrado
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
                      <FormLabel>Data de Fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>Motivo do Atestado</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Cirurgia, repouso, etc."
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
                      "Atualizar Atestado"
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
