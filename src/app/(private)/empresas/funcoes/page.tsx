"use client";

import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { columns } from "./components/data-table/columns";
import { DataTable } from "./components/data-table/data-table";
import { getRolesByCompany } from "./services/get-roles-by-company";
import { RoleObjectResponse } from "./interfaces/role-interface";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function RolesPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const {
    data: roles = [],
    isLoading,
    isError,
  } = useQuery<RoleObjectResponse[]>({
    queryKey: ["roles", companyId],
    queryFn: () => getRolesByCompany(companyId!),
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
              <BreadcrumbItem>
                <BreadcrumbPage>Funções</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Link href={"funcoes/criar"}>
            <Button size="sm">
              <UserCog className="mr-2 h-4 w-4" />
              Adicionar Função
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 overflow-hidden p-4 pt-0">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
          {isLoading && roles.length === 0 ? (
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
                {"Não foi possível buscar as funções"}
              </p>
              <DataTable columns={columns} data={roles} />
            </div>
          ) : (
            <DataTable columns={columns} data={roles} />
          )}
        </div>
      </div>
    </div>
  );
}
