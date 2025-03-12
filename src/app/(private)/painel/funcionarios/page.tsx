"use client";

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
// Importe o novo componente
import { EmployeesDataTable } from "./components/employees-data-table";

export default function EmployeesPage() {
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isEmployeeEditModalOpen, setIsEmployeeEditModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
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
      id: "4",
      fullName: "Ana Oliveira",
      cpf: "123.456.789-10",
      birthDate: "1990-05-15",
      position: "Analista de Sistemas",
      department: "TI",
      contractType: "CLT",
      salary: 4500,
      additionalInfo: "Sem observações",
      projectOrCostCenter: "Projeto A",
    },
    {
      id: "5",
      fullName: "Carlos Silva",
      cpf: "987.654.321-00",
      birthDate: "1985-10-20",
      position: "Desenvolvedor Front-end",
      department: "Desenvolvimento",
      contractType: "PJ",
      salary: 7000,
      additionalInfo: "Informações de saúde: Hipertensão",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "6",
      fullName: "Mariana Costa",
      cpf: "111.222.333-44",
      birthDate: "1992-03-30",
      position: "Desenvolvedor Back-end",
      department: "Desenvolvimento",
      contractType: "CLT",
      salary: 5000,
      additionalInfo: "Informações de saúde: Diabetes",
      projectOrCostCenter: "Projeto C",
    },
    {
      id: "7",
      fullName: "Eduardo Pereira",
      cpf: "222.333.444-55",
      birthDate: "1980-07-12",
      position: "Engenheiro de Software",
      department: "Infraestrutura",
      contractType: "CLT",
      salary: 8000,
      additionalInfo: "Sem observações",
      projectOrCostCenter: "Projeto D",
    },
    {
      id: "8",
      fullName: "Fernanda Souza",
      cpf: "333.444.555-66",
      birthDate: "1995-11-25",
      position: "Designer UX/UI",
      department: "Design",
      contractType: "PJ",
      salary: 6500,
      additionalInfo: "Informações de saúde: Alergia a amendoim",
      projectOrCostCenter: "Projeto A",
    },
    {
      id: "9",
      fullName: "Bruno Lima",
      cpf: "444.555.666-77",
      birthDate: "1988-04-08",
      position: "Especialista em Redes",
      department: "Redes",
      contractType: "CLT",
      salary: 7500,
      additionalInfo: "Nenhuma observação",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "10",
      fullName: "Gabriela Rocha",
      cpf: "555.666.777-88",
      birthDate: "1978-01-17",
      position: "Administrador de Sistemas",
      department: "TI",
      contractType: "CLT",
      salary: 9000,
      additionalInfo: "Informações de saúde: Asma",
      projectOrCostCenter: "Projeto C",
    },
    {
      id: "11",
      fullName: "Ricardo Mendes",
      cpf: "666.777.888-99",
      birthDate: "1983-09-05",
      position: "Consultor de TI",
      department: "Consultoria",
      contractType: "PJ",
      salary: 5500,
      additionalInfo: "Sem observações",
      projectOrCostCenter: "Projeto D",
    },
    {
      id: "12",
      fullName: "Patrícia Dias",
      cpf: "777.888.999-11",
      birthDate: "1991-12-31",
      position: "Analista de Dados",
      department: "Análise de Dados",
      contractType: "CLT",
      salary: 6000,
      additionalInfo: "Informações de saúde: Intolerância à lactose",
      projectOrCostCenter: "Projeto A",
    },
    {
      id: "13",
      fullName: "Roberto Almeida",
      cpf: "888.999.000-22",
      birthDate: "1987-06-22",
      position: "Gerente de Projetos",
      department: "Operações",
      contractType: "CLT",
      salary: 8500,
      additionalInfo: "Informações de saúde: Alergia a látex",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "14",
      fullName: "Sofia Martins",
      cpf: "999.000.111-33",
      birthDate: "1993-02-14",
      position: "Coordenador de Suporte",
      department: "Suporte",
      contractType: "PJ",
      salary: 4800,
      additionalInfo: "Sem observações",
      projectOrCostCenter: "Projeto C",
    },
    {
      id: "15",
      fullName: "João Ferreira",
      cpf: "012.345.678-90",
      birthDate: "1989-08-03",
      position: "Técnico de Informática",
      department: "TI",
      contractType: "CLT",
      salary: 5200,
      additionalInfo: "Informações de saúde: Colesterol alto",
      projectOrCostCenter: "Projeto D",
    },
    {
      id: "16",
      fullName: "Paula Ribeiro",
      cpf: "123.123.123-12",
      birthDate: "1975-03-19",
      position: "Analista de Segurança",
      department: "Segurança",
      contractType: "CLT",
      salary: 9500,
      additionalInfo: "Sem observações",
      projectOrCostCenter: "Projeto A",
    },
    {
      id: "17",
      fullName: "Luiz Barbosa",
      cpf: "234.234.234-23",
      birthDate: "1994-07-07",
      position: "Desenvolvedor Mobile",
      department: "Mobile",
      contractType: "PJ",
      salary: 7000,
      additionalInfo: "Informações de saúde: Pressão alta",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "18",
      fullName: "Camila Gomes",
      cpf: "345.345.345-34",
      birthDate: "1982-11-11",
      position: "Arquiteto de Software",
      department: "Arquitetura",
      contractType: "CLT",
      salary: 10000,
      additionalInfo: "Nenhuma observação",
      projectOrCostCenter: "Projeto C",
    },
    {
      id: "19",
      fullName: "André Carvalho",
      cpf: "456.456.456-45",
      birthDate: "1996-04-27",
      position: "Engenheiro de Dados",
      department: "Dados",
      contractType: "CLT",
      salary: 4300,
      additionalInfo: "Informações de saúde: Alergia a frutos do mar",
      projectOrCostCenter: "Projeto D",
    },
    {
      id: "20",
      fullName: "Juliana Teixeira",
      cpf: "567.567.567-56",
      birthDate: "1981-05-06",
      position: "Especialista em Cloud",
      department: "Cloud",
      contractType: "PJ",
      salary: 6600,
      additionalInfo: "Sem observações",
      projectOrCostCenter: "Projeto A",
    },
    {
      id: "21",
      fullName: "Renato Azevedo",
      cpf: "678.678.678-67",
      birthDate: "1986-09-09",
      position: "Analista de QA",
      department: "Qualidade",
      contractType: "CLT",
      salary: 7200,
      additionalInfo: "Informações de saúde: Hipotireoidismo",
      projectOrCostCenter: "Projeto B",
    },
    {
      id: "22",
      fullName: "Cláudia Nunes",
      cpf: "789.789.789-78",
      birthDate: "1990-10-10",
      position: "Gerente de Operações",
      department: "Operações",
      contractType: "CLT",
      salary: 8800,
      additionalInfo: "Nenhuma observação",
      projectOrCostCenter: "Projeto C",
    },
    {
      id: "23",
      fullName: "Diego Freitas",
      cpf: "890.890.890-89",
      birthDate: "1979-12-12",
      position: "Consultor de Negócios",
      department: "Negócios",
      contractType: "PJ",
      salary: 5400,
      additionalInfo: "Informações de saúde: Asma",
      projectOrCostCenter: "Projeto D",
    },
  ]);

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees([...employees, { ...newEmployee, id: Date.now().toString() }]);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeEditModalOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setIsEmployeeEditModalOpen(false);
    setSelectedEmployee(null);
    toast.success("Funcionário atualizado com sucesso");
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsConfirmationModalOpen(true);
  };

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      toast.success("Funcionário excluído com sucesso");
      setIsConfirmationModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <Card className="bg-white h-full">
      <CardContent className="p-4 h-full">
        <div className="space-y-4">
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
  );
}
