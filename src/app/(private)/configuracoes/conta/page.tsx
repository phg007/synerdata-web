"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Crown,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CompanyObjectResponse } from "../../empresas/interfaces/company-interface";
import { getCompanyById } from "../../empresas/services/get-company-by-id";
import { getSubscriptionData } from "./services/get-subscription-data";
import { SubscriptionDataResponse } from "../../empresas/interfaces/subscription-interface";
import { getPlanBadgeColors } from "@/app/(public)/pagamento/utils/checkout-utils";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const { data: company, isLoading: isCompanyLoading } =
    useQuery<CompanyObjectResponse>({
      queryKey: ["company", companyId],
      queryFn: () => getCompanyById(companyId!),
      enabled: !!companyId,
    });

  const subscriptionId = company?.idAssinatura;

  const { data: planData, isLoading: isSubscriptionLoading } =
    useQuery<SubscriptionDataResponse>({
      queryKey: ["subscription", subscriptionId],
      queryFn: () => getSubscriptionData(subscriptionId!),
      enabled: !!subscriptionId,
    });

  if (status === "loading" || isCompanyLoading || isSubscriptionLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Configurações</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="text-slate-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  const planColors = getPlanBadgeColors(planData?.items[0].name || "Ouro");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Configurações</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 pt-0">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Configurações da Conta
            </h1>
            <p className="text-slate-600 mt-1">
              Gerencie as informações da sua organização e assinatura
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5" />
                      <span>Informações da Empresa</span>
                    </CardTitle>
                    <CardDescription>
                      Dados principais da organização
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {company?.nomeFantasia}
                      </h3>
                      <p className="text-slate-600">{company?.razaoSocial}</p>
                      <p className="text-sm text-slate-500">
                        CNPJ: {company?.cnpj}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Data de Fundação
                      </p>
                      <p className="text-sm text-slate-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {company?.dataFundacao}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Faturamento Anual
                      </p>
                      <p className="text-sm text-slate-600 flex items-center">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(company?.faturamento || 0)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Regime Tributário
                      </p>
                      <p className="text-sm text-slate-600">
                        {company?.regimeTributario}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Inscrição Estadual
                      </p>
                      <p className="text-sm text-slate-600">
                        {company?.inscricaoEstadual}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        CNAE Principal
                      </p>
                      <p className="text-sm text-slate-600 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {company?.cnaePrincipal}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Segmento
                      </p>
                      <p className="text-sm text-slate-600">
                        {company?.segmento}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Ramo de Atuação
                      </p>
                      <p className="text-sm text-slate-600">
                        {company?.ramoAtuacao}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Quantidade de Funcionarios
                      </p>
                      <p className="text-sm text-slate-600">
                        Até {company?.quantidadeFuncionarios}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Endereço</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      {company?.rua}, {company?.numero}
                      {company?.complemento && `, ${company.complemento}`}
                    </p>
                    <p className="text-sm text-slate-600">
                      {company?.bairro} - {company?.cidade}/{company?.estado}
                    </p>
                    <p className="text-sm text-slate-600">
                      CEP: {company?.cep}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Contato</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        E-mail
                      </p>
                      <p className="text-sm text-slate-600 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {company?.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Celular
                      </p>
                      <p className="text-sm text-slate-600">
                        {company?.celular}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Telefone
                      </p>
                      <p className="text-sm text-slate-600">
                        {company?.telefone ?? "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5" />
                    <span>Plano Atual</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${planColors.bg} ${planColors.text} mb-2`}
                    >
                      {planData?.items[0].name}
                    </div>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(
                        (planData?.items[0].pricing_scheme.price ?? 0) / 100
                      )}
                    </p>
                    <p className="text-sm text-slate-500">
                      por {planData?.interval === "anual" ? "ano" : "mês"}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Status:</span>
                      <Badge
                        variant={
                          planData?.status === "active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {planData?.status === "active" ? "Ativa" : "Cancelada"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Contratado em:</span>
                      <span className="font-medium">{planData?.start_at}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Próxima cobrança:</span>
                      <span className="font-medium">
                        {planData?.next_billing_at}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Precisa de Ajuda?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      asChild
                    >
                      <Link href="/contato">
                        Contatar Suporte
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
