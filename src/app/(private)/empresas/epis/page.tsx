"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EPIsDataTable } from "./components/datatable/epis-data-table";
import DashboardLayout from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getEPIs } from "@/app/(private)/empresas/epis/services/get-epis";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { columns } from "./components/datatable/columns";

export default function EPIsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const companyId = session?.user.empresa;

  const {
    data: epis = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["epis", companyId],
    queryFn: () => getEPIs(companyId!),
    enabled: !!companyId,
  });

  const handleAddEPI = () => {
    router.push("/empresas/epis/adicionar");
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <Card className="bg-white h-full">
      <CardContent className="p-4 h-full">
        <div className="space-y-4 h-full">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">EPIs Cadastrados</h2>
            <div className="flex gap-2">
              <Button onClick={handleAddEPI} disabled={isLoading}>
                <Shield className="mr-2 h-4 w-4" />
                Adicionar EPI
              </Button>
            </div>
          </div>

          {isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-red-500 mb-4">
                Ocorreu um erro ao carregar os dados.
              </p>
              <Button onClick={handleRefresh}>Tentar novamente</Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <DataTable columns={columns} data={epis} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
