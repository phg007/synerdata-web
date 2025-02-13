"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  LogOut,
  ChevronDown,
  UserPlus,
  PlusCircle,
} from "lucide-react";

import { UserFormModal, User } from "@/components/user-form-modal";
import { Company, CompanyFormModal } from "@/components/company-form-modal";

import { Toaster } from "@/components/ui/toaster";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EmployeeFormModal, Employee } from "@/components/employee-form-modal";
import {
  OccurrenceFormModal,
  Occurrence,
} from "@/components/occurrence-form-modal";

export default function DashboardPage() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .overflow-x-auto::-webkit-scrollbar {
        height: 10px;
      }
      .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
      }
      .overflow-x-auto::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isOccurrenceFormOpen, setIsOccurrenceFormOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "João Silva", email: "joao@example.com", role: "admin" },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@example.com",
      role: "manager",
    },
    {
      id: "3",
      name: "Pedro Oliveira",
      email: "pedro@example.com",
      role: "viewer",
    },
  ]);
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
  ]);
  const [occurrences, setOccurrences] = useState<Occurrence[]>([
    {
      id: "1",
      type: "falta",
      employeeId: "1",
      date: "2023-06-01",
      reason: "Problemas de saúde",
    },
    {
      id: "2",
      type: "promocao",
      employeeId: "2",
      newPosition: "Designer Sênior",
      newSalary: 5500,
      reason: "Excelente desempenho",
    },
    {
      id: "3",
      type: "ferias",
      employeeId: "3",
      acquisitionPeriod: "2022-2023",
    },
  ]);
  const router = useRouter();

  const handleLogout = () => {
    // In a real application, you would handle the logout logic here
    router.push("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Usuários", icon: Users },
    { id: "employees", label: "Funcionários", icon: Users },
    { id: "company", label: "Empresa", icon: Building2 },
    { id: "occurrences", label: "Ocorrências", icon: FileText },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
  };

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleAddCompany = (newCompany: Company) => {
    setCompanies([...companies, newCompany]);
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees([...employees, newEmployee]);
  };

  const handleAddOccurrence = (newOccurrence: Occurrence) => {
    setOccurrences([...occurrences, newOccurrence]);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navigation bar */}
      <header className="bg-[#340D64] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Synerdata</h1>
            <nav className="flex items-center space-x-4">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`text-white ${
                    activeMenu === item.id ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
                Usuário
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 bg-[#340D64]">
        <Card className="bg-white h-full">
          <CardContent className="p-4 h-full">
            {activeMenu === "dashboard" && (
              <div className="w-full h-full">
                <Card className="w-full h-full">
                  <CardContent className="p-0 w-full h-full">
                    <iframe
                      title="Power BI Report"
                      width="100%"
                      height="100%"
                      src="https://app.powerbi.com/view?r=eyJrIjoiZTk1ZTY4MmQtYjdmMi00YWQyLWE2MTUtYzgzM2ZhNTQwNjBiIiwidCI6ImY1NzczNDE4LWViZjctNGZiNi1iYWEwLTdiNGUyNWYxZTE5NCJ9"
                      allowFullScreen={true}
                      style={{ border: "none" }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
            {activeMenu === "users" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Usuários Cadastrados</h2>
                  <Button onClick={() => setIsUserFormOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Função</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(newRole) =>
                              handleRoleChange(user.id, newRole)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                Administrador da empresa
                              </SelectItem>
                              <SelectItem value="manager">
                                Gestor de funcionários
                              </SelectItem>
                              <SelectItem value="viewer">
                                Visualizador
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {activeMenu === "employees" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    Funcionários Cadastrados
                  </h2>
                  <Button onClick={() => setIsEmployeeFormOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Funcionário
                  </Button>
                </div>
                <div className="rounded-md border">
                  <div className="h-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome Completo</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Data de Nascimento</TableHead>
                          <TableHead>Cargo/Função</TableHead>
                          <TableHead>Setor</TableHead>
                          <TableHead>Tipo de Contrato</TableHead>
                          <TableHead>Salário</TableHead>
                          <TableHead>Dados Complementares</TableHead>
                          <TableHead>Projeto/Centro de Custo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>{employee.fullName}</TableCell>
                            <TableCell>{employee.cpf}</TableCell>
                            <TableCell>{employee.birthDate}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.contractType}</TableCell>
                            <TableCell>
                              {employee.salary.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </TableCell>
                            <TableCell>{employee.additionalInfo}</TableCell>
                            <TableCell>
                              {employee.projectOrCostCenter}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            {activeMenu === "company" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Empresas Cadastradas</h2>
                  <Button onClick={() => setIsCompanyFormOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Empresa
                  </Button>
                </div>
                <div className="rounded-md border">
                  <div className="h-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome Fantasia</TableHead>
                          <TableHead>Razão Social</TableHead>
                          <TableHead>CNPJ</TableHead>
                          <TableHead>Segmento</TableHead>
                          <TableHead>Regime Tributário</TableHead>
                          <TableHead>Endereço</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>CNAE</TableHead>
                          <TableHead>Setores</TableHead>
                          <TableHead>Filiais</TableHead>
                          <TableHead>Centros de Custo</TableHead>
                          <TableHead>EPIs</TableHead>
                          <TableHead>Dados Adicionais</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {companies.map((company) => (
                          <TableRow key={company.id}>
                            <TableCell>{company.fantasyName}</TableCell>
                            <TableCell>{company.legalName}</TableCell>
                            <TableCell>{company.cnpj}</TableCell>
                            <TableCell>{company.segment}</TableCell>
                            <TableCell>{company.taxRegime}</TableCell>
                            <TableCell>{company.address}</TableCell>
                            <TableCell>{company.phone}</TableCell>
                            <TableCell>{company.cnae}</TableCell>
                            <TableCell>{company.sectors}</TableCell>
                            <TableCell>{company.branches}</TableCell>
                            <TableCell>{company.costCenters}</TableCell>
                            <TableCell>{company.ppEs}</TableCell>
                            <TableCell>{company.additionalData}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            {activeMenu === "occurrences" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Ocorrências</h2>
                  <Button onClick={() => setIsOccurrenceFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar Ocorrência
                  </Button>
                </div>
                <div className="rounded-md border">
                  <div className="h-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Funcionário</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Detalhes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {occurrences.map((occurrence) => {
                          const employee = employees.find(
                            (e) => e.id === occurrence.employeeId
                          );
                          return (
                            <TableRow key={occurrence.id}>
                              <TableCell>{occurrence.type}</TableCell>
                              <TableCell>{employee?.fullName}</TableCell>
                              <TableCell>{occurrence.date || "-"}</TableCell>
                              <TableCell>
                                {occurrence.type === "falta" &&
                                  `Motivo: ${occurrence.reason}`}
                                {occurrence.type === "promocao" &&
                                  `Nova função: ${occurrence.newPosition}, Novo salário: ${occurrence.newSalary}`}
                                {occurrence.type === "ferias" &&
                                  `Período aquisitivo: ${occurrence.acquisitionPeriod}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <UserFormModal
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onAddUser={handleAddUser}
      />
      <CompanyFormModal
        isOpen={isCompanyFormOpen}
        onClose={() => setIsCompanyFormOpen(false)}
        onAddCompany={handleAddCompany}
      />
      <EmployeeFormModal
        isOpen={isEmployeeFormOpen}
        onClose={() => setIsEmployeeFormOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
      <OccurrenceFormModal
        isOpen={isOccurrenceFormOpen}
        onClose={() => setIsOccurrenceFormOpen(false)}
        onAddOccurrence={handleAddOccurrence}
        employees={employees}
      />
      <Toaster />
    </div>
  );
}
