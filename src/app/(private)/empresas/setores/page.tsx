"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/dashboard-layout";
import { ConfirmationModal } from "@/components/confirmation-modal";
import {
  Department,
  DepartmentFormData,
  DepartmentFormModal,
} from "./components/features/department-form-modal";
import { DepartmentsDataTable } from "./components/datatable/departments-data-table";

import { getDepartments } from "@/app/api/department/get-departaments";
import { createDepartment } from "@/app/api/department/create-department";
import { updateDepartment } from "@/app/api/department/update-department";
import { deleteDepartment } from "@/app/api/department/delete-department";

export default function DepartmentsPage() {
  const [isDepartmentFormOpen, setIsDepartmentFormOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);

  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const empresa = session?.user.empresa;
  const token = session?.accessToken;

  const {
    data: departments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartments(empresa!, token!),
    enabled: !!empresa && !!token,
  });

  const addDepartmentMutation = useMutation({
    mutationFn: (data: DepartmentFormData) =>
      createDepartment(data, empresa!, token!),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(response.message || "Departamento adicionado com sucesso");
      setIsDepartmentFormOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao adicionar departamento"
      );
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartmentFormData }) =>
      updateDepartment(data, token!, id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(response.message);
      setIsDepartmentFormOpen(false);
      setSelectedDepartment(null);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar departamento");
      console.error(error);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => deleteDepartment(token!, id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });

      toast.success(response.message);
      setIsConfirmationModalOpen(false);
      setDepartmentToDelete(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir departamento");
      console.error(error);
    },
  });

  const handleAddDepartment = (data: DepartmentFormData) =>
    addDepartmentMutation.mutate(data);
  const handleEditDepartment = (dept: Department) => {
    setSelectedDepartment(dept);
    setIsDepartmentFormOpen(true);
  };
  const handleUpdateDepartment = (department: { id: string; nome: string }) => {
    updateDepartmentMutation.mutate({
      id: department.id,
      data: { nome: department.nome },
    });
  };

  const handleDeleteDepartment = (dept: Department) => {
    setDepartmentToDelete(dept);
    setIsConfirmationModalOpen(true);
  };
  const confirmDeleteDepartment = () =>
    departmentToDelete &&
    deleteDepartmentMutation.mutate(departmentToDelete.id);

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Departamentos Cadastrados</h2>
              <Button
                onClick={() => {
                  setSelectedDepartment(null);
                  setIsDepartmentFormOpen(true);
                }}
                disabled={isLoading || addDepartmentMutation.isPending}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Departamento
              </Button>
            </div>

            {isError ? (
              <div className="text-center text-red-500">
                Erro ao carregar os dados.
                <Button onClick={() => refetch()}>Tentar novamente</Button>
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
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
            message={`Deseja excluir o departamento ${departmentToDelete?.nome}?`}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
