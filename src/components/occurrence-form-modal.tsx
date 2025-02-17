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
import { Employee } from "./employee-form-modal";

type OccurrenceFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddOccurrence: (occurrence: Occurrence) => void;
  employees: Employee[];
};

export type Occurrence = {
  id: string;
  type: string;
  employeeId: string;
  date?: string;
  reason?: string;
  startDate?: string;
  endDate?: string;
  newPosition?: string;
  newSalary?: number;
  legalReason?: string;
  legalAction?: string;
  dismissalType?: string;
  cpfStatus?: string;
  cpfIssues?: string;
  description?: string;
  actionsTaken?: string;
  newProject?: string;
  projectStartDate?: string;
  caseDetails?: string;
  caseKnowledgeDate?: string;
  items?: string;
  itemReason?: string;
  responsiblePerson?: string;
  acquisitionPeriod?: string;
};

export function OccurrenceFormModal({
  isOpen,
  onClose,
  onAddOccurrence,
  employees,
}: OccurrenceFormModalProps) {
  const [occurrenceType, setOccurrenceType] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [formData, setFormData] = useState<Partial<Occurrence>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!occurrenceType || !employeeId) {
      toast({
        title: "Erro",
        description:
          "Por favor, selecione o tipo de ocorrência e o funcionário.",
        variant: "destructive",
      });
      return;
    }

    const newOccurrence: Occurrence = {
      id: Date.now().toString(),
      type: occurrenceType,
      employeeId,
      ...formData,
    };

    onAddOccurrence(newOccurrence);
    toast({
      title: "Ocorrência registrada com sucesso",
      description: "A ocorrência foi adicionada ao histórico do funcionário.",
    });
    onClose();
    setOccurrenceType("");
    setEmployeeId("");
    setFormData({});
  };
  const { toast } = useToast();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Nova Ocorrência</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para registrar uma nova ocorrência.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="occurrenceType">Tipo de Ocorrência</Label>
            <Select
              value={occurrenceType}
              onValueChange={(value) => setOccurrenceType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de ocorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="falta">Falta</SelectItem>
                <SelectItem value="atestado">Atestado</SelectItem>
                <SelectItem value="promocao">Promoção</SelectItem>
                <SelectItem value="demissao">Demissão</SelectItem>
                <SelectItem value="analiseCPF">Análise de CPF</SelectItem>
                <SelectItem value="acidente">Acidente</SelectItem>
                <SelectItem value="atualizacaoProjeto">
                  Atualização do Projeto
                </SelectItem>
                <SelectItem value="advertencia">Advertência</SelectItem>
                <SelectItem value="acaoTrabalhista">
                  Ação Trabalhista
                </SelectItem>
                <SelectItem value="epi">EPI</SelectItem>
                <SelectItem value="ferias">Férias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Funcionário</Label>
            <Select
              value={employeeId}
              onValueChange={(value) => setEmployeeId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o funcionário" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {occurrenceType === "falta" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "atestado" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Justificativa</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "promocao" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newPosition">Nova Função</Label>
                <Input
                  id="newPosition"
                  name="newPosition"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newSalary">Novo Salário</Label>
                <Input
                  type="number"
                  id="newSalary"
                  name="newSalary"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Justificativa</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "demissao" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalReason">Motivo Trabalhista</Label>
                <Input
                  id="legalReason"
                  name="legalReason"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalAction">Ação Trabalhista</Label>
                <Input
                  id="legalAction"
                  name="legalAction"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dismissalType">Forma de Demissão</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("dismissalType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de demissão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voluntaria">Voluntária</SelectItem>
                    <SelectItem value="justa_causa">Justa Causa</SelectItem>
                    <SelectItem value="sem_justa_causa">
                      Sem Justa Causa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {occurrenceType === "analiseCPF" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cpfStatus">Status do CPF</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("cpfStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status do CPF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpfIssues">Problemas ou Restrições</Label>
                <Textarea
                  id="cpfIssues"
                  name="cpfIssues"
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {occurrenceType === "acidente" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actionsTaken">Medidas Tomadas</Label>
                <Textarea
                  id="actionsTaken"
                  name="actionsTaken"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "atualizacaoProjeto" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newProject">Novo Projeto</Label>
                <Input
                  id="newProject"
                  name="newProject"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectStartDate">
                  Data de Início no Novo Projeto
                </Label>
                <Input
                  type="date"
                  id="projectStartDate"
                  name="projectStartDate"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "advertencia" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "acaoTrabalhista" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="caseDetails">Dados do Processo</Label>
                <Textarea
                  id="caseDetails"
                  name="caseDetails"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseKnowledgeDate">Data do Conhecimento</Label>
                <Input
                  type="date"
                  id="caseKnowledgeDate"
                  name="caseKnowledgeDate"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "epi" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Itens Disponibilizados</Label>
                <Textarea
                  id="items"
                  name="items"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemReason">Motivo</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("itemReason", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="substituicao">Substituição</SelectItem>
                    <SelectItem value="mau_uso">Mau Uso</SelectItem>
                    <SelectItem value="vencimento">Vencimento</SelectItem>
                    <SelectItem value="furto">Furto</SelectItem>
                    <SelectItem value="roubo">Roubo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsiblePerson">
                  Responsável pela Entrega
                </Label>
                <Input
                  id="responsiblePerson"
                  name="responsiblePerson"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {occurrenceType === "ferias" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="acquisitionPeriod">Período Aquisitivo</Label>
                <Input
                  id="acquisitionPeriod"
                  name="acquisitionPeriod"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
