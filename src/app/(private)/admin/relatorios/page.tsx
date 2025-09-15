"use client";

import { useState } from "react";
import { ManagementForm } from "./_components/management-form";
import { CompanyInfoCard } from "./_components/company-info-card";
import { DashboardPreview } from "./_components/dashboard-preview";

export default function ManagementPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [powerBiLink, setPowerBiLink] = useState<string>("");

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Gestão de Dashboards</h1>
        <p className="text-muted-foreground">
          Selecione uma empresa para configurar o link do Power BI e visualizar
          informações.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
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
  );
}
