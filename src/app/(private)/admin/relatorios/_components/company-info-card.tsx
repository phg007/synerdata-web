"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Users, UserCheck, FileText } from "lucide-react";
import { getCompanyById } from "@/app/(private)/empresas/services/get-company-by-id";
import { formatCNPJ } from "@/app/(public)/pagamento/utils/checkout-utils";
import { getUsersByCompany } from "@/app/(private)/usuarios/services/get-users-by-company";
import { getEmployeesByCompany } from "@/app/(private)/funcionarios/services/get-employees-by-company";

interface CompanyInfoCardProps {
  companyId: string;
}

export function CompanyInfoCard({ companyId }: CompanyInfoCardProps) {
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompanyById(companyId),
    enabled: !!companyId,
  });

  const { data: employeesResponse, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees", companyId],
    queryFn: () => getEmployeesByCompany(companyId),
    enabled: !!companyId,
  });

  const { data: usersByCompany, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["userCount", companyId],
    queryFn: () => getUsersByCompany(companyId),
    enabled: !!companyId,
  });

  const isLoading = isLoadingCompany || isLoadingEmployees || isLoadingUsers;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {company.nomeFantasia}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span>
            CNPJ: <span>{formatCNPJ(company.cnpj)}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>
            Total de Funcionários:{" "}
            <span className="font-semibold">
              {employeesResponse?.length ?? 0}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <UserCheck className="h-5 w-5 text-muted-foreground" />
          <span>
            Usuários na Plataforma:{" "}
            <span className="font-semibold">{usersByCompany?.length ?? 0}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
