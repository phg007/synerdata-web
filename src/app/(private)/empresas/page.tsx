"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CompanyFormModal,
  type Company,
} from "@/components/company-form-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { toast } from "sonner";
// Importe o novo componente
import { CompaniesDataTable } from "./components/companies-data-table";
import DashboardLayout from "@/components/dashboard-layout";
export default function CompanyPage() {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      fantasyName: "Tech Solutions",
      legalName: "Tech Solutions Ltda",
      cnpj: "12.345.678/0001-01",
      address: "Rua da Inovação, 123",
      phone: "(11) 1234-5678",
      additionalData: "Empresa de tecnologia",
      taxRegime: "simples",
      cnae: "6201-5/01",
      segment: "Desenvolvimento de Software",
      logo: null,
      sectors: "TI, Suporte",
      branches: "São Paulo, Rio de Janeiro",
      costCenters: "Desenvolvimento, Administrativo",
      ppEs: "Óculos de proteção",
    },
    {
      id: "2",
      fantasyName: "Green Energy",
      legalName: "Green Energy S.A.",
      cnpj: "98.765.432/0001-01",
      address: "Avenida Sustentável, 456",
      phone: "(21) 9876-5432",
      additionalData: "Empresa de energia renovável",
      taxRegime: "lucro_presumido",
      cnae: "3511-5/01",
      segment: "Energia Solar",
      logo: null,
      sectors: "Engenharia, Vendas",
      branches: "Belo Horizonte, Salvador",
      costCenters: "Projetos, Instalação",
      ppEs: "Capacete, Luvas isolantes",
    },
    {
      id: "3",
      fantasyName: "Fresh Foods",
      legalName: "Fresh Foods Eireli",
      cnpj: "45.678.901/0001-01",
      address: "Rua dos Sabores, 789",
      phone: "(31) 4567-8901",
      additionalData: "Empresa de alimentos orgânicos",
      taxRegime: "lucro_real",
      cnae: "1013-9/01",
      segment: "Alimentos Orgânicos",
      logo: null,
      sectors: "Produção, Logística",
      branches: "Curitiba, Porto Alegre",
      costCenters: "Cultivo, Embalagem",
      ppEs: "Touca, Avental",
    },
  ]);

  const handleAddCompany = (newCompany: Company) => {
    setCompanies([...companies, newCompany]);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(
      companies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
    setIsEditModalOpen(false);
    setSelectedCompany(null);
    toast.success("Empresa atualizada com sucesso");
  };

  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCompany = () => {
    if (selectedCompany) {
      setCompanies(
        companies.filter((company) => company.id !== selectedCompany.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
      toast.success("Empresa excluída com sucesso");
    }
  };

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Empresas Cadastradas</h2>
              <Button onClick={() => setIsCompanyFormOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Empresa
              </Button>
            </div>
            <CompaniesDataTable
              data={companies}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
            />
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
            message={`Tem certeza que deseja excluir a empresa ${selectedCompany?.fantasyName}?`}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
