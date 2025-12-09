"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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

import { createEpiDelivery } from "../services/create-epi-delivery";
import {
  getEmployeesByCompany,
  EmployeeObjectResponse,
} from "../services/get-employees-by-company";

import { EpiObjectResponse } from "@/app/(private)/empresas/epis/interfaces/epi-interfaces";
import { getEPIsByCompany } from "@/app/(private)/empresas/epis/services/get-epis-by-company";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  funcionarioId: z
    .string({ required_error: "Selecione o funcionário" })
    .min(1, "Selecione o funcionário"),
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
    .array(z.string(), {
      required_error: "Selecione pelo menos um EPI",
    })
    .min(1, "Selecione pelo menos um EPI"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateEpiDeliveryPage() {
  const { data: session } = useSession();
  const companyId = session?.user.empresa ?? "";

  const { data: employees = [] } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId),
    enabled: Boolean(companyId),
  });

  const { data: epis = [] } = useQuery<EpiObjectResponse[]>({
    queryKey: ["epis", companyId],
    queryFn: () => getEPIsByCompany(companyId),
    enabled: Boolean(companyId),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      funcionarioId: "",
      data: "",
      motivo: "",
      entreguePor: "",
      epis: [],
    },
    mode: "onChange",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createEpiDelivery,
    onSuccess: () => {
      toast.success("Entrega cadastrada");
      form.reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
                <BreadcrumbPage>Criar</BreadcrumbPage>
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
                Selecione o funcionário e os EPIs entregues
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => mutateAsync(data))}
                  className="space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="funcionarioId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Funcionário <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o funcionário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employees.map((employee) => (
                                <SelectItem
                                  key={employee.id}
                                  value={employee.id}
                                >
                                  {employee.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="data"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Data da Entrega{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
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
                        <FormLabel>
                          EPIs <span className="text-red-500">*</span>
                        </FormLabel>
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

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="motivo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Motivo <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="entreguePor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Entregue Por <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end border-t pt-6">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Cadastrar Entrega"
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
