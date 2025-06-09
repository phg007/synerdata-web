"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CompanyFormModal,
  type Company,
} from "@/components/company-form-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { toast } from "sonner";
import { CompaniesDataTable } from "./_components/companies-data-table";
import { companyService } from "@/lib/company-service";
import DashboardLayout from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyPage(): React.ReactElement {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again later.");
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompany = async (
    newCompany: Omit<Company, "id">
  ): Promise<void> => {
    try {
      const companyData = {
        nomeFantasia: newCompany.nomeFantasia,
        razaoSocial: newCompany.razaoSocial,
        cnpj: newCompany.cnpj,
        rua: newCompany.rua,
        numero: newCompany.numero,
        complemento: newCompany.complemento,
        bairro: newCompany.bairro,
        cidade: newCompany.cidade,
        estado: newCompany.estado,
        cep: newCompany.cep,
        dataFundacao: newCompany.dataFundacao,
        telefone: newCompany.telefone,
        faturamento: newCompany.faturamento,
        regimeTributario: newCompany.regimeTributario,
        inscricaoEstadual: newCompany.inscricaoEstadual,
        cnaePrincipal: newCompany.cnaeprincipal,
        segmento: newCompany.segmento,
        ramoAtuacao: newCompany.ramoAtuacao,
        logoUrl: "https://example.com/logo.png",
        status: "A",
        criadoPor: 1,
      };

      console.log(companyData);
      const createdCompany = await companyService.createCompany(companyData);
      setCompanies([...companies, createdCompany]);
      toast.success("Empresa adicionada com sucesso");
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Falha ao adicionar empresa");
    }
  };

  const handleEditCompany = (company: Company): void => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const handleUpdateCompany = async (
    updatedCompany: Company
  ): Promise<void> => {
    try {
      await companyService.updateCompany(updatedCompany);
      setCompanies(
        companies.map((company) =>
          company.id === updatedCompany.id ? updatedCompany : company
        )
      );
      setIsEditModalOpen(false);
      setSelectedCompany(null);
      toast.success("Empresa atualizada com sucesso");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Falha ao atualizar empresa");
    }
  };

  const handleDeleteCompany = (company: Company): void => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCompany = async (): Promise<void> => {
    if (selectedCompany) {
      try {
        await companyService.deleteCompany(selectedCompany.id);
        setCompanies(
          companies.filter((company) => company.id !== selectedCompany.id)
        );
        setIsDeleteModalOpen(false);
        setSelectedCompany(null);
        toast.success("Empresa excluída com sucesso");
      } catch (error) {
        console.error("Error deleting company:", error);
        toast.error("Falha ao excluir empresa");
      }
    }
  };

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Empresas Cadastradas</h2>
              <Button onClick={() => setIsCompanyFormOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Empresa
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : error ? (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            ) : (
              <CompaniesDataTable
                data={companies}
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
              />
            )}
          </div>
          <CompanyFormModal
            isOpen={isCompanyFormOpen}
            onClose={() => setIsCompanyFormOpen(false)}
            onAddCompany={handleAddCompany}
          />
          <CompanyFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onAddCompany={handleUpdateCompany}
            initialData={selectedCompany}
          />
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteCompany}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir a empresa ${selectedCompany?.nomeFantasia}?`}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
