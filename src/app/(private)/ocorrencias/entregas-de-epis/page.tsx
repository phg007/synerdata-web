"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./components/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getEpiDeliveriesByCompany } from "./services/get-epi-deliveries-by-company";
import { useSession } from "next-auth/react";
import { columns } from "./components/datatable/columns";
import Link from "next/link";
import { EpiDeliveryObjectResponse } from "./interfaces/epi-delivery-interfaces";

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
    <div className="container mx-auto p-4">
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Entregas de EPIs</h2>
              <div className="flex gap-2">
                <Link href="entregas-de-epis/criar">
                  <Button disabled={isLoading}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Registrar Entrega
                  </Button>
                </Link>
              </div>
            </div>

            {isLoading && deliveries.length === 0 ? (
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
                  Não foi possível buscar as entregas
                </p>
                <DataTable columns={columns} data={deliveries} />
              </div>
            ) : (
              <DataTable columns={columns} data={deliveries} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
