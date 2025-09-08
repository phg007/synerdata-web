"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getCompanies } from "../_services/get-companies";
import { getCompanyById } from "@/app/(private)/empresas/services/get-company-by-id";
import { updatePbUrl } from "../_services/save-pb-url";

interface ManagementFormProps {
  onCompanySelect: (companyId: string | null) => void;
  onLinkChange: (link: string) => void;
}

export function ManagementForm({
  onCompanySelect,
  onLinkChange,
}: ManagementFormProps) {
  const queryClient = useQueryClient();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [link, setLink] = useState("");

  const { data: companiesResponse, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });

  const { data: selectedCompany } = useQuery({
    queryKey: ["company", selectedCompanyId],
    queryFn: () => getCompanyById(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });

  useEffect(() => {
    const newLink = selectedCompany?.pbUrl || "";
    setLink(newLink);
    onLinkChange(newLink);
  }, [selectedCompany, onLinkChange]);

  const updateLinkMutation = useMutation({
    mutationFn: ({ companyId, link }: { companyId: string; link: string }) =>
      updatePbUrl({ pbUrl: link, empresaId: companyId }),
    onSuccess: (updatedCompany) => {
      toast.success(
        `Link do Power BI para "${updatedCompany?.data?.nomeFantasia}" atualizado com sucesso!`
      );
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({
        queryKey: ["company", updatedCompany?.data?.id],
      });
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar o link: ${error.message}`);
    },
  });

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    onCompanySelect(companyId);
  };

  const handleLinkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setLink(newLink);
    onLinkChange(newLink);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompanyId) {
      console.log(selectedCompanyId);
      console.log(link);

      updateLinkMutation.mutate({ companyId: selectedCompanyId, link });
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>Configuração</CardTitle>
        <CardDescription>
          Selecione a empresa e insira o link do dashboard do Power BI.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-select">Empresa</Label>
            {isLoadingCompanies ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                onValueChange={handleCompanyChange}
                value={selectedCompanyId || ""}
              >
                <SelectTrigger id="company-select">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companiesResponse?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.nomeFantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedCompanyId && (
            <>
              <div className="space-y-2">
                <Label htmlFor="powerbi-link">Link do Power BI</Label>
                <Input
                  id="powerbi-link"
                  value={link}
                  onChange={handleLinkInputChange}
                  placeholder="https://app.powerbi.com/..."
                />
              </div>
              <Button
                type="submit"
                disabled={updateLinkMutation.isPending}
                className="w-full"
              >
                {updateLinkMutation.isPending ? "Salvando..." : "Salvar Link"}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
