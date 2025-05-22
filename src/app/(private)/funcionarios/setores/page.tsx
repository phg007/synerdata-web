"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ConfirmationModal } from "@/components/confirmation-modal";

import DashboardLayout from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createDepartment } from "@/app/api/department/create-department";
import { updateDepartment } from "@/app/api/department/update-department";
import { deleteDepartment } from "@/app/api/department/delete-department";
import { DepartmentsDataTable } from "./components/datatable/departments-data-table";
import { getDepartments } from "@/app/api/department/get-departaments";
import {
  Department,
  DepartmentFormData,
  DepartmentFormModal,
} from "./components/features/department-form-modal";

export default function DepartmentsPage(): React.ReactElement {
  const [isDepartmentFormOpen, setIsDepartmentFormOpen] =
    useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);

  const queryClient = useQueryClient();

  const {
    data: departments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const addDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(response.message || "Departmento adicionado com sucesso");
      setIsDepartmentFormOpen(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Erro ao adicionar departmento. Tente novamente mais tarde."
        );
      }
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Departmento atualizado com sucesso");
      setIsDepartmentFormOpen(false);
      setSelectedDepartment(null);
    },
    onError: (error) => {
      console.error("Erro ao atualizar departmento:", error);
      toast.error("Erro ao atualizar departmento. Tente novamente mais tarde.");
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Departmento excluído com sucesso");
      setIsConfirmationModalOpen(false);
      setDepartmentToDelete(null);
    },
    onError: (error) => {
      console.error("Erro ao excluir departmento:", error);
      toast.error("Erro ao excluir departmento. Tente novamente mais tarde.");
    },
  });

  const handleAddDepartment = (departmentData: DepartmentFormData): void => {
    addDepartmentMutation.mutate(departmentData);
  };

  const handleEditDepartment = (department: Department): void => {
    setSelectedDepartment(department);
    setIsDepartmentFormOpen(true);
  };

  const handleUpdateDepartment = (updatedDepartment: Department): void => {
    updateDepartmentMutation.mutate(updatedDepartment);
  };

  const handleDeleteDepartment = (department: Department): void => {
    setDepartmentToDelete(department);
    setIsConfirmationModalOpen(true);
  };

  const confirmDeleteDepartment = (): void => {
    if (!departmentToDelete) return;
    deleteDepartmentMutation.mutate(departmentToDelete.id);
  };

  const handleRefresh = async (): Promise<void> => {
    await refetch();
    toast.success("Dados atualizados com sucesso");
  };

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Departmentos Cadastrados</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedDepartment(null);
                    setIsDepartmentFormOpen(true);
                  }}
                  disabled={isLoading || addDepartmentMutation.isPending}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Departmento
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
              <DepartmentsDataTable
                data={departments}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
              />
            )}
          </div>

          <DepartmentFormModal
            isOpen={isDepartmentFormOpen}
            onClose={() => {
              setIsDepartmentFormOpen(false);
              setSelectedDepartment(null);
            }}
            onAddDepartment={handleAddDepartment}
            onUpdateDepartment={handleUpdateDepartment}
            department={selectedDepartment}
          />

          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={confirmDeleteDepartment}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir o departmento ${departmentToDelete?.nome}?`}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
