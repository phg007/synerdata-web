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
import { ArrowLeft, Loader2 } from "lucide-react";
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

const editMedicalCertificateSchema = z.object({
  motivo: z
    .string()
    .min(1, "O motivo é obrigatório")
    .max(255, "O motivo deve ter no máximo 255 caracteres"),
  cid: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        /^([A-TV-Z][0-9]{2})(\.[0-9A-Z]{1,2})?$/.test(value),
      {
        message: "O CID deve seguir o formato válido (ex: J45.0)",
      }
    ),
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
      cid: "",
      dataInicio: "",
      dataFim: "",
    },
  });

  useEffect(() => {
    if (medicalCertificate) {
      const [diaInicio, mesInicio, anoInicio] =
        medicalCertificate.dataInicio.split("/");
      const [diaFim, mesFim, anoFim] = medicalCertificate.dataFim.split("/");

      form.reset({
        motivo: medicalCertificate.motivo,
        cid: medicalCertificate.cid || "",
        dataInicio: `${anoInicio}-${mesInicio}-${diaInicio}`,
        dataFim: `${anoFim}-${mesFim}-${diaFim}`,
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
                <BreadcrumbLink href="/ocorrencias/atestados">
                  Atestados
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
            <Link href="/ocorrencias/atestados">
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
                    name="motivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Motivo do Atestado{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="cid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: J45.0" />
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
                      name="dataFim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Data de Fim <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
    </div>
  );
}
