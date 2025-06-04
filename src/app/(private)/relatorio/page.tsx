"use client";

import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import ReportUnderDevelopment from "./components/report-under-development";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getPbUrlByCompany } from "./services/get-pburl-by-company";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user.empresa;
  const [retryCount, setRetryCount] = useState(0);

  const {
    data: pbUrl,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["pburl", companyId, retryCount],
    queryFn: () => getPbUrlByCompany(companyId!),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);
    await refetch();
  };

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

  if (!pbUrl) {
    return (
      <DashboardLayout>
        <ReportUnderDevelopment onRetry={handleRetry} isRetrying={isFetching} />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[600px]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <div className="text-red-500 mb-4">
                <svg
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {error.message}
              </h2>
              <p className="text-slate-600 mb-4">
                Ocorreu um problema técnico. Tente novamente em alguns
                instantes.
              </p>
              <button
                onClick={handleRetry}
                disabled={isFetching}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isFetching ? "Tentando..." : "Tentar Novamente"}
              </button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="w-full h-full">
            <Card className="w-full h-full">
              <CardContent className="p-0 w-full h-full">
                <iframe
                  title="Power BI Report"
                  width="100%"
                  height="100%"
                  src={pbUrl}
                  allowFullScreen
                  style={{ border: "none" }}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
