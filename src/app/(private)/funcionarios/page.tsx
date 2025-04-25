"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmployeeFormModal,
  type Employee,
} from "@/components/employee-form-modal";
import { EmployeeEditModal } from "@/components/employee-edit-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { EmployeesDataTable } from "./components/employees-data-table";
import DashboardLayout from "@/components/dashboard-layout";

export default function EmployeesPage(): React.ReactElement {
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
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      fullName: "Carlos Silva",
      cpf: "123.456.789-00",
      birthDate: "1985-05-15",
      position: "Desenvolvedor",
      department: "TI",
      contractType: "CLT",
      salary: 5000,
      additionalInfo: "Endereço: Rua A, 123",
      projectOrCostCenter: "Projeto A",
    },
    {
      id: "2",
      fullName: "Ana Oliveira",
      cpf: "987.654.321-00",
      birthDate: "1990-10-20",
      position: "Designer",
      department: "Marketing",
      contractType: "PJ",
      salary: 4500,
      additionalInfo: "Contato: (11) 98765-4321",
      projectOrCostCenter: "Centro de Custo 1",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },

    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },

    {
      id: "3",
      fullName: "Roberto Santos",
      cpf: "456.789.123-00",
      birthDate: "1988-03-25",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
  ]);

  const handleAddEmployee = (newEmployee: Employee): void => {
    setEmployees([...employees, { ...newEmployee, id: Date.now().toString() }]);
  };

  const handleEditEmployee = (employee: Employee): void => {
    setSelectedEmployee(employee);
    setIsEmployeeEditModalOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee): void => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setIsEmployeeEditModalOpen(false);
    setSelectedEmployee(null);
    toast.success("Funcionário atualizado com sucesso");
  };

  const handleDeleteEmployee = (employee: Employee): void => {
    setEmployeeToDelete(employee);
    setIsConfirmationModalOpen(true);
  };

  const confirmDeleteEmployee = (): void => {
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      toast.success("Funcionário excluído com sucesso");
      setIsConfirmationModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Funcionários Cadastrados</h2>
              <Button onClick={() => setIsEmployeeFormOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Funcionário
              </Button>
            </div>
            <EmployeesDataTable
              data={employees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
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
