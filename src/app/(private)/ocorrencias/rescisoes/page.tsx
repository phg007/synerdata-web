"use client";

import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./components/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getTerminationsByCompany } from "./services/get-terminations-by-company";
import { useSession } from "next-auth/react";
import { columns } from "./components/datatable/columns";
import Link from "next/link";
import { TerminationObjectResponse } from "./interfaces/termination-interfaces";

export default function TerminationsPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const {
    data: terminations = [],
    isLoading,
    isError,
  } = useQuery<TerminationObjectResponse[]>({
    queryKey: ["terminations", companyId],
    queryFn: () => getTerminationsByCompany(companyId!),
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
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Rescisões Cadastradas</h2>
              <div className="flex gap-2">
                <Link href={"rescisoes/criar"}>
                  <Button disabled={isLoading}>
                    <UserX className="mr-2 h-4 w-4" />
                    Adicionar Rescisão
                  </Button>
                </Link>
              </div>
            </div>

            {isLoading && terminations.length === 0 ? (
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
                  Não foi possível buscar as rescisões
                </p>
                <DataTable columns={columns} data={terminations} />
              </div>
            ) : (
              <DataTable columns={columns} data={terminations} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
