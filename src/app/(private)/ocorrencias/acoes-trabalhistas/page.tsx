"use client";

import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./components/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getLaborActionsByCompany } from "./services/get-labor-actions-by-company";
import { useSession } from "next-auth/react";
import { columns } from "./components/datatable/columns";
import Link from "next/link";
import { LaborActionObjectResponse } from "./interfaces/labor-action";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function LaborActionsPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const {
    data: laborActions = [],
    isLoading,
    isError,
  } = useQuery<LaborActionObjectResponse[]>({
    queryKey: ["labor-actions", companyId],
    queryFn: () => getLaborActionsByCompany(companyId!),
    enabled: !!companyId,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
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
                <BreadcrumbPage>Ações Trabalhistas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Link href={"acoes-trabalhistas/criar"}>
            <Button disabled={isLoading} size="sm">
              <Scale className="mr-2 h-4 w-4" />
              Adicionar Ação
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 overflow-hidden p-4 pt-0">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
          {isLoading && laborActions.length === 0 ? (
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
                Não foi possível buscar as ações trabalhistas
              </p>
              <DataTable columns={columns} data={laborActions} />
            </div>
          ) : (
            <DataTable columns={columns} data={laborActions} />
          )}
        </div>
      </div>
    </div>
  );
}
