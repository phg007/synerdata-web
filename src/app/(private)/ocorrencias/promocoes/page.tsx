"use client";

import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./components/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getPromotionsByCompany } from "./services/get-promotions-by-company";
import { useSession } from "next-auth/react";
import { columns } from "./components/datatable/columns";
import Link from "next/link";
import { PromotionObjectResponse } from "./interfaces/promotion-interfaces";

export default function PromotionsPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const {
    data: promotions = [],
    isLoading,
    isError,
  } = useQuery<PromotionObjectResponse[]>({
    queryKey: ["promotions", companyId],
    queryFn: () => getPromotionsByCompany(companyId!),
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
              <h2 className="text-2xl font-bold">Promoções Cadastradas</h2>
              <div className="flex gap-2">
                <Link href={"promocoes/adicionar"}>
                  <Button disabled={isLoading}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Adicionar Promoção
                  </Button>
                </Link>
              </div>
            </div>

            {isLoading && promotions.length === 0 ? (
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
                  Não foi possível buscar as promoções
                </p>
                <DataTable columns={columns} data={promotions} />
              </div>
            ) : (
              <DataTable columns={columns} data={promotions} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
