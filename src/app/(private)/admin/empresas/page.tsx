"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./_components/data-table/columns";
import { DataTable } from "./_components/data-table/data-table";
import { getCompaniesWithStats } from "./_services/get-companies-with-stats";

export default function UsersPage() {
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["companies-with-stats"],
    queryFn: () => getCompaniesWithStats(),
  });

  if (isLoading) {
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
              <h2 className="text-2xl font-bold">Empresas</h2>
            </div>
            {isLoading && users.length === 0 ? (
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
                  {"Não foi possível buscar as empresas"}
                </p>
                <DataTable columns={columns} data={users} />
              </div>
            ) : (
              <DataTable columns={columns} data={users} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
