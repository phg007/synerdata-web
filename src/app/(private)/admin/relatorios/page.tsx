"use client";

import { useState } from "react";
import { ManagementForm } from "./_components/management-form";
import { CompanyInfoCard } from "./_components/company-info-card";
import { DashboardPreview } from "./_components/dashboard-preview";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function AdminReportsPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [powerBiLink, setPowerBiLink] = useState<string>("");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Relatórios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 overflow-hidden p-4 pt-0">
        <div className="flex h-full flex-col overflow-auto rounded-xl border bg-background shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Gestão de Dashboards</h1>
              <p className="text-muted-foreground">
                Selecione uma empresa para configurar o link do Power BI e
                visualizar informações.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ManagementForm
                  onCompanySelect={setSelectedCompanyId}
                  onLinkChange={setPowerBiLink}
                />
                {selectedCompanyId && (
                  <CompanyInfoCard companyId={selectedCompanyId} />
                )}
              </div>

              <div className="lg:col-span-2">
                <DashboardPreview powerBiLink={powerBiLink} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
