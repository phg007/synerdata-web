"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import { getEpiDeliveryById } from "../../services/get-epi-delivery-by-id";
import { updateEpiDelivery } from "../../services/update-epi-delivery";
import { EpiDeliveryObjectResponse } from "../../interfaces/epi-delivery-interfaces";

import { getEPIsByCompany } from "@/app/(private)/empresas/epis/services/get-epis-by-company";
import { EpiObjectResponse } from "@/app/(private)/empresas/epis/interfaces/epi-interfaces";
import { use, useEffect } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
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

const schema = z.object({
  data: z
    .string({ required_error: "Informe a data da entrega" })
    .min(1, "Informe a data da entrega"),
  motivo: z
    .string({ required_error: "Informe o motivo da entrega" })
    .min(1, "Informe o motivo da entrega"),
  entreguePor: z
    .string({ required_error: "Informe quem entregou" })
    .min(1, "Informe quem entregou"),
  epis: z
    .array(z.string(), { required_error: "Selecione pelo menos um EPI" })
    .min(1, "Selecione pelo menos um EPI"),
});

type FormValues = z.infer<typeof schema>;

export default function UpdateEpiDeliveryPage({
  params,
}: {
  params: Promise<{ epiDeliveryId: string }>;
}) {
  const { data: session } = useSession();
  const companyId = session?.user.empresa ?? "";

  const { epiDeliveryId } = use(params);
  const queryClient = useQueryClient();

  const { data: delivery } = useQuery<EpiDeliveryObjectResponse>({
    queryKey: ["epi-delivery", epiDeliveryId],
    queryFn: () => getEpiDeliveryById(epiDeliveryId),
    enabled: Boolean(epiDeliveryId),
  });

  const { data: epis = [] } = useQuery<EpiObjectResponse[]>({
    queryKey: ["epis", companyId],
    queryFn: () => getEPIsByCompany(companyId),
    enabled: Boolean(companyId),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      data: "",
      motivo: "",
      entreguePor: "",
      epis: [],
    },
  });

  useEffect(() => {
    if (!delivery) return;
    const [d, m, y] = delivery.data.split("/");
    form.reset({
      data: `${y}-${m}-${d}`,
      motivo: delivery.motivo,
      entreguePor: delivery.entreguePor,
      epis: delivery.epis.map((e) => e.id),
    });
  }, [delivery, form]);

  const { mutateAsync: updateEpiDeliveryFn, isPending } = useMutation({
    mutationFn: updateEpiDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epi-deliveries"] });
      toast.success("Entrega atualizada");
      form.reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = async (data: FormValues) => {
    await updateEpiDeliveryFn({
      ...data,
      epiDeliveryId,
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
                <BreadcrumbLink href="/ocorrencias/entregas-de-epis">
                  Entregas de EPIs
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
            <Link href="/ocorrencias/entregas-de-epis">
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
              <CardTitle>Informações da Entrega</CardTitle>
              <CardDescription>
                Atualize os dados necessários e clique em{" "}
                <strong>Atualizar Entrega</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="data"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Entrega</FormLabel>
                          <Input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motivo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivo</FormLabel>
                          <Input {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="epis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EPIs</FormLabel>
                        <FormControl>
                          <MultiSelect<EpiObjectResponse>
                            items={epis}
                            value={field.value || []}
                            onChange={field.onChange}
                            getItemValue={(epi) => epi.id}
                            getItemLabel={(epi) => epi.nome}
                            placeholder="Selecione os EPIs"
                            searchPlaceholder="Buscar EPIs..."
                            emptyMessage="Nenhum EPI encontrado."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="entreguePor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entregue Por</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end border-t pt-6">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        "Atualizar Entrega"
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
