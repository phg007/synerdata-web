"use client";

import type React from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { completeCompanyRegistration } from "./services/complete-company-registration";
import { NumericFormat } from "react-number-format";
import { updateFirstAccess } from "./services/update-first-access";

const organizacaoSchema = z.object({
  dataFundacao: z.string().min(1, "Data de fundação é obrigatória"),
  faturamento: z.number().min(0, "Faturamento deve ser maior que 0"),
  regimeTributario: z
    .string()
    .min(1, "Regime tributário é obrigatório")
    .max(50, "Máximo 50 caracteres"),
  inscricaoEstadual: z
    .string()
    .min(1, "Inscrição estadual é obrigatória")
    .max(50, "Máximo 50 caracteres"),
  cnaePrincipal: z
    .string()
    .min(1, "CNAE principal é obrigatório")
    .max(50, "Máximo 50 caracteres"),
  segmento: z
    .string()
    .min(1, "Segmento é obrigatório")
    .max(100, "Máximo 100 caracteres"),
  ramoAtuacao: z
    .string()
    .min(1, "Ramo de atuação é obrigatório")
    .max(100, "Máximo 100 caracteres"),
});

type OrganizacaoFormData = z.infer<typeof organizacaoSchema>;

const regimesTributarios = [
  { value: "SIMPLES_NACIONAL", label: "Simples Nacional" },
  { value: "LUCRO_PRESUMIDO", label: "Lucro Presumido" },
  { value: "LUCRO_REAL", label: "Lucro Real" },
  { value: "MEI", label: "MEI - Microempreendedor Individual" },
];

const segmentos = [
  { value: "COMERCIO", label: "Comércio" },
  { value: "INDUSTRIA", label: "Indústria" },
  { value: "SERVICOS", label: "Serviços" },
  { value: "AGRONEGOCIO", label: "Agronegócio" },
  { value: "TECNOLOGIA", label: "Tecnologia" },
  { value: "SAUDE", label: "Saúde" },
  { value: "EDUCACAO", label: "Educação" },
  { value: "FINANCEIRO", label: "Financeiro" },
  { value: "OUTROS", label: "Outros" },
];

const formatCNAE = (value: string) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue.replace(/(\d{4})(\d{1})(\d{2})/, "$1-$2/$3");
};

export default function FinalizarCadastroPage() {
  const router = useRouter();

  const form = useForm<OrganizacaoFormData>({
    resolver: zodResolver(organizacaoSchema),
    defaultValues: {
      dataFundacao: "",
      faturamento: 0,
      regimeTributario: "",
      inscricaoEstadual: "",
      cnaePrincipal: "",
      segmento: "",
      ramoAtuacao: "",
    },
  });

  const { mutateAsync: completeCompanyRegistrationFn, isPending } = useMutation(
    {
      mutationFn: completeCompanyRegistration,
      onSuccess: async () => {
        const session = await getSession();

        if (session?.user.id) {
          try {
            await updateFirstAccess(session.user.id);
          } catch (error) {
            toast.warning(
              "Cadastro finalizado, mas não foi possível atualizar o primeiro acesso."
            );
            console.error(error);
          }
        }

        toast.success("Organização cadastrada com sucesso");
        router.replace("/relatorio");
      },
      onError: (error: Error) => {
        toast.error("Erro ao completar o cadastro da empresa", {
          description: error.message,
        });
      },
    }
  );

  const handleCNAEChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCNAE(e.target.value);
    form.setValue("cnaePrincipal", formattedValue, { shouldValidate: true });
  };

  const onSubmit = async (data: OrganizacaoFormData) => {
    const session = await getSession();

    if (!session || !session.user?.empresa) {
      router.replace("/login");
      return;
    }

    await completeCompanyRegistrationFn({
      ...data,
      empresaId: session.user.empresa,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Finalizar Cadastro da Organização
          </h1>
          <p className="text-white/80">
            Complete as informações da sua empresa para começar a usar o sistema
          </p>
        </div>

        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-indigo-600" />
              <span>Informações da Organização</span>
            </CardTitle>
            <CardDescription>
              Preencha os dados complementares da sua empresa para finalizar o
              cadastro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dataFundacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data de Fundação{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="faturamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Faturamento (R$){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            placeholder="0,00"
                            value={field.value}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              field.onChange(floatValue ?? 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="regimeTributario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Regime Tributário{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o regime" />
                            </SelectTrigger>
                            <SelectContent>
                              {regimesTributarios.map((regime) => (
                                <SelectItem
                                  key={regime.value}
                                  value={regime.value}
                                >
                                  {regime.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inscricaoEstadual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Inscrição Estadual{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 123.456.789.012" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cnaePrincipal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CNAE Principal <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0000-0/00"
                            {...field}
                            onChange={handleCNAEChange}
                            maxLength={9}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="segmento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Segmento <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o segmento" />
                            </SelectTrigger>
                            <SelectContent>
                              {segmentos.map((segmento) => (
                                <SelectItem
                                  key={segmento.value}
                                  value={segmento.value}
                                >
                                  {segmento.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ramoAtuacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ramo de Atuação <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Desenvolvimento de software, Consultoria empresarial, etc."
                          {...field}
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
                        Cadastrando...
                      </>
                    ) : (
                      "Finalizar cadastro"
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
