"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { createEpiDelivery } from "../services/create-epi-delivery";
import {
  getEmployeesByCompany,
  EmployeeObjectResponse,
} from "../services/get-employees-by-company";

import { EpiObjectResponse } from "@/app/(private)/empresas/epis/interfaces/epi-interfaces";
import { getEPIsByCompany } from "@/app/(private)/empresas/epis/services/get-epis-by-company";

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
    <div className="py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Link
            href="/ocorrencias/entregas-de-epis"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Entregas
          </Link>
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Nova Entrega de EPIs
            </h1>
          </div>
        </div>

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
                        <FormLabel>Funcionário</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {field.value
                                ? employees.find((e) => e.id === field.value)
                                    ?.nome
                                : "Selecione o funcionário"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              <CommandInput placeholder="Buscar..." />
                              <CommandEmpty>Nenhum encontrado</CommandEmpty>
                              <CommandGroup>
                                {employees.map((e) => (
                                  <CommandItem
                                    key={e.id}
                                    onSelect={() => field.onChange(e.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === e.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {e.nome}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Entrega</FormLabel>
                        <Input type="date" {...field} />
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {field.value.length > 0
                              ? `${field.value.length} selecionado(s)`
                              : "Selecione os EPIs"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar EPI..." />
                            <CommandEmpty>Nenhum encontrado</CommandEmpty>
                            <CommandGroup>
                              {epis.map((epi) => {
                                const checked = field.value.includes(epi.id);
                                return (
                                  <CommandItem
                                    key={epi.id}
                                    onSelect={() =>
                                      checked
                                        ? field.onChange(
                                            field.value.filter(
                                              (id) => id !== epi.id
                                            )
                                          )
                                        : field.onChange([
                                            ...field.value,
                                            epi.id,
                                          ])
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        checked ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {epi.nome}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                        <FormLabel>Motivo</FormLabel>
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
                        <FormLabel>Entregue Por</FormLabel>
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
  );
}
