"use client";

import { UploadIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { columns } from "./components/data-table/columns";
import { DataTable } from "./components/data-table/data-table";
import { getEmployeesByCompany } from "./services/get-employees-by-company";
import { EmployeeObjectResponse } from "./interfaces/employee-interface";

export default function EmployeesPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery<EmployeeObjectResponse[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId!),
    enabled: !!companyId,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Funcionários</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando...</p>
          </div>
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
                <BreadcrumbPage>Funcionários</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/funcionarios/importar">
              <UploadIcon className="h-4 w-4 md:mr-2" />
              <span className="md:inline">Importar</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/funcionarios/criar">
              <UserPlus className="h-4 w-4 md:mr-2" />
              <span className="md:inline">Adicionar</span>
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden p-4 pt-0">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
          {isError ? (
            <div className="p-4 text-center">
              <p className="text-amber-500">
                Não foi possível buscar os funcionários
              </p>
            </div>
          ) : null}
          <DataTable columns={columns} data={employees} />
        </div>
      </div>
    </div>
  );
}
