import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type EmployeeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Employee) => void;
};

export type Employee = {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  position: string;
  department: string;
  contractType: "CLT" | "PJ";
  salary: number;
  additionalInfo: string;
  projectOrCostCenter: string;
};

export function EmployeeFormModal({
  isOpen,
  onClose,
  onAddEmployee,
}: EmployeeFormModalProps) {
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [contractType, setContractType] = useState<"CLT" | "PJ">("CLT");
  const [salary, setSalary] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [projectOrCostCenter, setProjectOrCostCenter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName ||
      !cpf ||
      !birthDate ||
      !position ||
      !department ||
      !contractType ||
      !salary
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      fullName,
      cpf,
      birthDate,
      position,
      department,
      contractType,
      salary: parseFloat(salary),
      additionalInfo,
      projectOrCostCenter,
    };

    onAddEmployee(newEmployee);
    toast({
      title: "Funcionário adicionado com sucesso",
      description: "O cadastro foi confirmado.",
    });
    onClose();
    // Reset form
    setFullName("");
    setCpf("");
    setBirthDate("");
    setPosition("");
    setDepartment("");
    setContractType("CLT");
    setSalary("");
    setAdditionalInfo("");
    setProjectOrCostCenter("");
  };
  const { toast } = useToast();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo funcionário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Cargo/Função</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Setor</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractType">Tipo de contrato</Label>
            <Select
              value={contractType}
              onValueChange={(value: "CLT" | "PJ") => setContractType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLT">CLT</SelectItem>
                <SelectItem value="PJ">PJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salário</Label>
            <Input
              id="salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Dados complementares</Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Ex.: endereço, contatos, informações de saúde"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectOrCostCenter">
              Projeto ou Centro de Custo
            </Label>
            <Input
              id="projectOrCostCenter"
              value={projectOrCostCenter}
              onChange={(e) => setProjectOrCostCenter(e.target.value)}
            />
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
