"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./components/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getEpiDeliveriesByCompany } from "./services/get-epi-deliveries-by-company";
import { useSession } from "next-auth/react";
import { columns } from "./components/datatable/columns";
import Link from "next/link";
import { EpiDeliveryObjectResponse } from "./interfaces/epi-delivery-interfaces";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function EpiDeliveriesPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const {
    data: deliveries = [],
    isLoading,
    isError,
  } = useQuery<EpiDeliveryObjectResponse[]>({
    queryKey: ["epi-deliveries", companyId],
    queryFn: () => getEpiDeliveriesByCompany(companyId!),
    enabled: !!companyId,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

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
              <BreadcrumbItem>
                <BreadcrumbPage>Entregas de EPIs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Link href="entregas-de-epis/criar">
            <Button disabled={isLoading} size="sm">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Registrar Entrega
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 overflow-hidden p-4 pt-0">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
          {isLoading && deliveries.length === 0 ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <div className="p-4 text-center">
              <p className="text-amber-500">
                Não foi possível buscar as entregas
              </p>
              <DataTable columns={columns} data={deliveries} />
            </div>
          ) : (
            <DataTable columns={columns} data={deliveries} />
          )}
        </div>
      </div>
    </div>
  );
}
