"use client";

import type React from "react";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Building2,
  AtSign,
  Phone,
  Smartphone,
  Loader2,
  ExternalLink,
  Lock,
  Check,
  X,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  formatCNPJ,
  formatPhone,
  isValidCNPJ,
  formatMobilePhone,
} from "../utils/checkout-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPaymentLink } from "../services/get-payment-link";
import { useState } from "react";

const plansData = {
  "Ouro Insights": {
    name: "Ouro Insights",
    description: "Essencial para contratações eficazes",
    icon: "🥇",
    color: "from-yellow-400 to-yellow-600",
    prices: {
      "0-10": 399.0,
      "11-20": 449.9,
      "21-30": 499.9,
      "31-40": 559.9,
      "41-50": 619.9,
      "51-60": 699.9,
      "61-70": 779.9,
      "71-80": 869.9,
      "81-90": 969.9,
      "91-180": 1079.9,
    },
    features: [
      { name: "Demitidos", available: true },
      { name: "Faltas", available: true },
      { name: "Atestados", available: true },
      { name: "Acidentes", available: true },
      { name: "Advertências", available: true },
      { name: "Status do Trabalhador", available: true },
      { name: "Aniversariantes", available: false },
      { name: "EPI", available: false },
      { name: "Ficha Cadastral", available: false },
      { name: "Folha", available: false },
    ],
  },
  "Diamante Analytics": {
    name: "Diamante Analytics",
    description: "Todos os recursos premium",
    icon: "💎",
    color: "from-blue-400 to-blue-600",
    prices: {
      "0-10": 499.0,
      "11-20": 559.9,
      "21-30": 619.9,
      "31-40": 689.9,
      "41-50": 760.9,
      "51-60": 849.9,
      "61-70": 940.9,
      "71-80": 1049.9,
      "81-90": 1159.9,
      "91-180": 1288.9,
    },
    features: [
      { name: "Demitidos", available: true },
      { name: "Faltas", available: true },
      { name: "Atestados", available: true },
      { name: "Acidentes", available: true },
      { name: "Advertências", available: true },
      { name: "Status do Trabalhador", available: true },
      { name: "Aniversariantes", available: true },
      { name: "EPI", available: true },
      { name: "Ficha Cadastral", available: true },
      { name: "Folha", available: false },
    ],
  },
  "Platina Vision": {
    name: "Platina Vision",
    description: "Recursos avançados de analytics",
    icon: "🥈",
    color: "from-slate-400 to-slate-600",
    prices: {
      "0-10": 599.0,
      "11-20": 669.9,
      "21-30": 739.9,
      "31-40": 821.9,
      "41-50": 912.9,
      "51-60": 1015.9,
      "61-70": 1129.9,
      "71-80": 1252.9,
      "81-90": 1399.9,
      "91-180": 1549.9,
    },
    features: [
      { name: "Demitidos", available: true },
      { name: "Faltas", available: true },
      { name: "Atestados", available: true },
      { name: "Acidentes", available: true },
      { name: "Advertências", available: true },
      { name: "Status do Trabalhador", available: true },
      { name: "Aniversariantes", available: true },
      { name: "EPI", available: true },
      { name: "Ficha Cadastral", available: true },
      { name: "Folha", available: true },
    ],
  },
};

const employeeOptions = [
  { value: "0-10", label: "0 a 10 funcionários" },
  { value: "11-20", label: "11 a 20 funcionários" },
  { value: "21-30", label: "21 a 30 funcionários" },
  { value: "31-40", label: "31 a 40 funcionários" },
  { value: "41-50", label: "41 a 50 funcionários" },
  { value: "51-60", label: "51 a 60 funcionários" },
  { value: "61-70", label: "61 a 70 funcionários" },
  { value: "71-80", label: "71 a 80 funcionários" },
  { value: "81-90", label: "81 a 90 funcionários" },
  { value: "91-180", label: "91 a 180 funcionários" },
];

const companySchema = z.object({
  razaoSocial: z.string().min(3, "Nome da empresa é obrigatório"),
  nomeFantasia: z.string().min(3, "Nome fantasia é obrigatório"),
  cnpj: z
    .string()
    .min(14, "CNPJ inválido")
    .max(18)
    .refine((val) => isValidCNPJ(val), {
      message: "CNPJ inválido",
    }),
  email: z.string().email("E-mail inválido"),
  telefone: z
    .string()
    .max(14, "Telefone inválido")
    .refine((val) => val === "" || val.length >= 14, {
      message: "Telefone inválido",
    }),
  celular: z.string().min(15, "Celular inválido").max(15),
  tipoPlano: z.string().min(1, "Plano é obrigatório"),
  quantidadeFuncionarios: z
    .string()
    .min(1, "Quantidade de funcionários é obrigatória"),
});
type CompanyFormData = z.infer<typeof companySchema>;

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "Ouro Insights";
  const [paymentLinkGenerated, setPaymentLinkGenerated] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      email: "",
      telefone: "",
      celular: "",
      tipoPlano: initialPlan,
      quantidadeFuncionarios: "0-10",
    },
  });

  const selectedPlan = form.watch("tipoPlano");
  const quantidadeFuncionarios = form.watch("quantidadeFuncionarios");

  const currentPlan = plansData[selectedPlan as keyof typeof plansData];
  const currentPrice =
    currentPlan?.prices[
      quantidadeFuncionarios as keyof typeof currentPlan.prices
    ] || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCNPJ(e.target.value);
    form.setValue("cnpj", formattedValue, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    form.setValue("telefone", formattedValue, { shouldValidate: true });
  };

  const handleMobilePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatMobilePhone(e.target.value);
    form.setValue("celular", formattedValue, {
      shouldValidate: true,
    });
  };

  const { mutateAsync: getPaymentLinkFn, isPending } = useMutation({
    mutationFn: getPaymentLink,
    onSuccess: (getPaymentLinkResponse) => {
      toast.success(
        "Link de pagamento gerado! Uma nova aba será aberta em breve."
      );
      setPaymentLink(getPaymentLinkResponse.url);
      setPaymentLinkGenerated(true);

      setTimeout(() => {
        window.open(getPaymentLinkResponse.url, "_blank");
      }, 2000);
    },
    onError: (error: Error) => {
      toast.error("Erro ao gerar link de pagamento. Tente novamente.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    await getPaymentLinkFn({
      ...data,
      cnpj: data.cnpj.replace(/\D/g, ""),
      telefone: data.telefone?.trim() || undefined,
      celular: data.celular?.trim(),
      preco: currentPrice,
    });
  };

  const handleBackToForm = () => {
    setPaymentLinkGenerated(false);
  };

  if (paymentLinkGenerated) {
    return (
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#340D64] mb-2">
              Link de Pagamento Gerado!
            </h1>
            <p className="text-gray-600 mb-4">
              O checkout do Pagar.me foi aberto em uma nova aba. Complete seu
              pagamento para ativar sua assinatura.
            </p>
            <p className="text-sm text-gray-500">
              Caso a nova aba não tenha sido aberta,{" "}
              <Button
                variant="link"
                onClick={() => window.open(paymentLink, "_blank")}
                className="p-0 text-[#340D64]"
              >
                clique aqui para acessar o link de pagamento
              </Button>
              .
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-[#340D64] mb-4">
              Resumo da sua contratação:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p>
                  <strong>Empresa:</strong> {form.getValues("razaoSocial")}
                </p>
                <p>
                  <strong>CNPJ:</strong> {form.getValues("cnpj")}
                </p>
                <p>
                  <strong>Email:</strong> {form.getValues("email")}
                </p>
              </div>
              <div className="text-left">
                <p>
                  <strong>Plano:</strong> {form.getValues("tipoPlano")}
                </p>
                <p>
                  <strong>Funcionários:</strong>{" "}
                  {form.getValues("quantidadeFuncionarios")}
                </p>
                <p>
                  <strong>Valor:</strong> {formatCurrency(currentPrice)}/mês
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">
                O que acontece agora?
              </h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Complete o pagamento na aba do Pagar.me</li>
                <li>• Você receberá um email de confirmação</li>
                <li>• Seu acesso será liberado automaticamente</li>
                <li>• Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleBackToForm}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Formulário
              </Button>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p>
                Precisa de ajuda? Entre em contato:{" "}
                <a
                  href="mailto:suporte@synnerdata.com"
                  className="text-[#340D64] hover:underline"
                >
                  suporte@synnerdata.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-5xl mx-auto px-4 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-6 space-y-4">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#340D64] mb-1">
                  Finalize sua contratação
                </h1>
                <p className="text-gray-600 text-sm">
                  Preencha os dados da sua organização
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="razaoSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome da empresa <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Empresa Ltda." {...field} />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Building2 className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomeFantasia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome fantasia <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="XYZ" {...field} />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Building2 className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CNPJ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00.000.000/0000-00"
                          {...field}
                          onChange={handleCnpjChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-mail <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="contato@empresa.com" {...field} />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <AtSign className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="(00) 0000-0000"
                            {...field}
                            onChange={handlePhoneChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Phone className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="celular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Celular <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="(00) 00000-0000"
                            {...field}
                            onChange={handleMobilePhoneChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Smartphone className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-[#340D64] mb-3 text-sm flex items-center gap-2">
                  <span className="text-lg">{currentPlan?.icon}</span>
                  Recursos incluídos no {selectedPlan}:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {currentPlan?.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {feature.available ? (
                        <Check className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                      ) : (
                        <X className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
                      )}
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-5 h-fit sticky top-6">
              <h2 className="text-lg font-bold text-[#340D64] mb-4">
                Resumo do Pedido
              </h2>

              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="tipoPlano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Plano
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um plano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(plansData).map(([key, plan]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <span>{plan.icon}</span>
                                <span>{plan.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div
                className={`bg-gradient-to-r ${currentPlan?.color} p-3 rounded-lg text-white mb-4`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{currentPlan?.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm">{currentPlan?.name}</h3>
                    <p className="text-white/90 text-xs">
                      {currentPlan?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="quantidadeFuncionarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Funcionários
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a quantidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Período:</span>
                  <span className="font-medium text-[#340D64]">Mensal</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Renovação:</span>
                  <span className="font-medium text-[#340D64]">Automática</span>
                </div>
              </div>

              <div className="bg-[#340D64]/5 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#340D64] text-sm">
                    Total Mensal:
                  </span>
                  <span className="text-xl font-bold text-[#340D64]">
                    {formatCurrency(currentPrice)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || form.formState.isLoading}
                  className={
                    "w-full py-3 px-4 rounded-lg font-semibold text-white text-sm"
                  }
                >
                  {isPending ? (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando link...
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Prosseguir para Pagamento
                      <ExternalLink />
                    </div>
                  )}
                </Button>
              </div>

              <div className="text-center mt-3">
                <div className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Lock className="h-4 w-4" />
                  Pagamento seguro via Pagar.me
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
