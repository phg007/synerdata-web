"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmployeeFormModal,
  type Employee,
} from "@/app/(private)/funcionarios/_components/employee-form-modal";
import { EmployeeEditModal } from "@/app/(private)/funcionarios/_components/employee-edit-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { EmployeesDataTable } from "./_components/datatable/employees-data-table";
import DashboardLayout from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { employeeService } from "@/lib/employee-service";

export default function EmployeesPage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState<boolean>(false);
  const [isEmployeeEditModalOpen, setIsEmployeeEditModalOpen] =
    useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Função para carregar funcionários - definida com useCallback para evitar recriações
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await employeeService.getEmployees();
      setEmployees(data);
      return true;
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      setIsError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees().then((success) => {
      if (!success) {
        toast.error(
          "Erro ao carregar funcionários. Tente novamente mais tarde."
        );
      }
    });
  }, [fetchEmployees]);

  // Adicionar novo funcionário
  const handleAddEmployee = async (
    newEmployeeData: Omit<Employee, "id">
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const addedEmployee =
        await employeeService.createEmployee(newEmployeeData);
      setEmployees((prev) => [...prev, addedEmployee]);
      toast.success("Funcionário adicionado com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar funcionário:", error);
      toast.error("Erro ao adicionar funcionário. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsEmployeeFormOpen(false);
    }
  };

  // Editar funcionário
  const handleEditEmployee = (employee: Employee): void => {
    setSelectedEmployee(employee);
    setIsEmployeeEditModalOpen(true);
  };

  // Atualizar funcionário
  const handleUpdateEmployee = async (
    updatedEmployee: Employee
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await employeeService.updateEmployee(updatedEmployee);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        )
      );
      toast.success("Funcionário atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      toast.error("Erro ao atualizar funcionário. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsEmployeeEditModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  // Preparar exclusão de funcionário
  const handleDeleteEmployee = (employee: Employee): void => {
    setEmployeeToDelete(employee);
    setIsConfirmationModalOpen(true);
  };

  // Confirmar exclusão de funcionário
  const confirmDeleteEmployee = async (): Promise<void> => {
    if (!employeeToDelete) return;

    try {
      setIsLoading(true);
      await employeeService.deleteEmployee(employeeToDelete.id);
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== employeeToDelete.id)
      );
      toast.success("Funcionário excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      toast.error("Erro ao excluir funcionário. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsConfirmationModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  // Recarregar dados
  const handleRefresh = async (): Promise<void> => {
    const success = await fetchEmployees();
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
              <h2 className="text-2xl font-bold">Funcionários Cadastrados</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEmployeeFormOpen(true)}
                  disabled={isLoading}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Funcionário
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
              <EmployeesDataTable
                data={employees}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            )}
          </div>

          <EmployeeFormModal
            isOpen={isEmployeeFormOpen}
            onClose={() => setIsEmployeeFormOpen(false)}
            onAddEmployee={handleAddEmployee}
          />

          <EmployeeEditModal
            isOpen={isEmployeeEditModalOpen}
            onClose={() => {
              setIsEmployeeEditModalOpen(false);
              setSelectedEmployee(null);
            }}
            onUpdateEmployee={handleUpdateEmployee}
            employee={selectedEmployee}
          />

          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={confirmDeleteEmployee}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir o funcionário ${employeeToDelete?.fullName}?`}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
