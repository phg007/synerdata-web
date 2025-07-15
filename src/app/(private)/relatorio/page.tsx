"use client";

import { getPbUrlByCompany } from "./services/get-pburl-by-company";
import CustomerReport from "./components/customer-report";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;

  const { data: pbUrl, isLoading } = useQuery({
    queryKey: ["pbUrl", companyId],
    queryFn: () => getPbUrlByCompany(companyId!),
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
    <div className="h-full">
      <CustomerReport pbUrl={pbUrl!} />
    </div>
  );
}
