"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// Atualizar a importação do EpiFormModal
import { EpiFormModal } from "./components/features/epi-form-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { EPIsDataTable } from "./components/epis-data-table";
import DashboardLayout from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { getEPIs, deleteEPI, type EPI } from "@/lib/epi-service";

export default function EPIsPage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isEPIFormOpen, setIsEPIFormOpen] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [selectedEPI, setSelectedEPI] = useState<EPI | null>(null);
  const [epiToDelete, setEPIToDelete] = useState<EPI | null>(null);
  const [epis, setEPIs] = useState<EPI[]>([]);

  // Função para carregar EPIs - definida com useCallback para evitar recriações
  const fetchEPIs = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getEPIs();
      setEPIs(data);
      return true;
    } catch (error) {
      console.error("Erro ao carregar EPIs:", error);
      setIsError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar EPIs ao inicializar a página
  useEffect(() => {
    fetchEPIs().then((success) => {
      if (!success) {
        toast.error("Erro ao carregar EPIs. Tente novamente mais tarde.");
      }
    });
  }, [fetchEPIs]);

  // Função para lidar com o sucesso do formulário
  const handleFormSuccess = () => {
    fetchEPIs();
  };

  // Editar EPI
  const handleEditEPI = (epi: EPI): void => {
    setSelectedEPI(epi);
    setIsEPIFormOpen(true);
  };

  // Preparar exclusão de EPI
  const handleDeleteEPI = (epi: EPI): void => {
    setEPIToDelete(epi);
    setIsConfirmationModalOpen(true);
  };

  // Confirmar exclusão de EPI
  const confirmDeleteEPI = async (): Promise<void> => {
    if (!epiToDelete) return;

    try {
      setIsLoading(true);
      await deleteEPI(epiToDelete.id);
      setEPIs((prev) => prev.filter((e) => e.id !== epiToDelete.id));
      toast.success("EPI excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir EPI:", error);
      toast.error("Erro ao excluir EPI. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsConfirmationModalOpen(false);
      setEPIToDelete(null);
    }
  };

  // Recarregar dados
  const handleRefresh = async (): Promise<void> => {
    const success = await fetchEPIs();
    if (success) {
      toast.success("Dados atualizados com sucesso");
    }
  };

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">EPIs Cadastrados</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEPIFormOpen(true)}
                  disabled={isLoading}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Adicionar EPI
                </Button>
              </div>
            </div>

            {isError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-red-500 mb-4">
                  Ocorreu um erro ao carregar os dados.
                </p>
                <Button onClick={handleRefresh}>Tentar novamente</Button>
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <EPIsDataTable
                data={epis}
                onEdit={handleEditEPI}
                onDelete={handleDeleteEPI}
              />
            )}
          </div>

          <EpiFormModal
            isOpen={isEPIFormOpen}
            onClose={() => {
              setIsEPIFormOpen(false);
              setSelectedEPI(null);
            }}
            onSuccess={handleFormSuccess}
            epi={selectedEPI}
          />

          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={confirmDeleteEPI}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir o EPI ${epiToDelete?.nome}?`}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
