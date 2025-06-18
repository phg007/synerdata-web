"use client";

import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { columns } from "./components/data-table/columns";
import { DataTable } from "./components/data-table/data-table";
import { getRolesByCompany } from "./services/get-roles-by-company";
import { RoleObjectResponse } from "./interfaces/role-interface";
import Link from "next/link";

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
    <div className="container mx-auto p-4">
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Funcões Cadastradas</h2>
              <Link href={"funcoes/criar"}>
                <Button>
                  <UserCog className="mr-2 h-4 w-4" />
                  Adicionar Função
                </Button>
              </Link>
            </div>
            {isLoading && roles.length === 0 ? (
              <div className="space-y-3">
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
        </CardContent>
      </Card>
    </div>
  );
}
