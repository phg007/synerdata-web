"use client";

import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { columns } from "./components/data-table/columns";
import { DataTable } from "./components/data-table/data-table";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateBranchDialog from "./components/create-branch-dialog";
import {
  getBranchesByCompany,
  GetBranchesByCompanyResponse,
} from "./services/get-branches-by-company";

export default function BranchesPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const [createBranchDialogOpen, setCreateBranchDialogOpen] = useState(false);

  const {
    data: branches = [],
    isLoading,
    isError,
  } = useQuery<GetBranchesByCompanyResponse[]>({
    queryKey: ["users", companyId],
    queryFn: () => getBranchesByCompany(companyId!),
    enabled: !!companyId,
  });

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Filiais Cadastradas</h2>

              <Dialog
                open={createBranchDialogOpen}
                onOpenChange={setCreateBranchDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Building className="mr-2 h-4 w-4" />
                    Adicionar Filial
                  </Button>
                </DialogTrigger>
                <CreateBranchDialog
                  companyId={companyId!}
                  setOpen={setCreateBranchDialogOpen}
                />
              </Dialog>
            </div>
            {isLoading && branches.length === 0 ? (
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
                  {"Não foi possível buscar as filiais"}
                </p>
                <DataTable columns={columns} data={branches} />
              </div>
            ) : (
              <DataTable columns={columns} data={branches} />
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
