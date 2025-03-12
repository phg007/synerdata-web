"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  OccurrenceFormModal,
  type Occurrence,
} from "@/components/occurrence-form-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { toast } from "sonner";
import type { Employee } from "@/components/employee-form-modal";
// Import the new component
import { OccurrencesDataTable } from "./components/occurrences-data-table";

export default function OccurrencesPage() {
  const [isOccurrenceFormOpen, setIsOccurrenceFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOccurrence, setSelectedOccurrence] =
    useState<Occurrence | null>(null);
  const [employees] = useState<Employee[]>([
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
    } as Occurrence,
    {
      id: "2",
      type: "promocao",
      employeeId: "2",
      newPosition: "Designer Sênior",
      newSalary: 5500,
      reason: "Excelente desempenho",
    } as Occurrence,
    {
      id: "3",
      type: "ferias",
      employeeId: "3",
      acquisitionPeriod: "2022-2023",
    } as Occurrence,
    {
      id: "4",
      type: "atestado",
      employeeId: "1",
      startDate: "2023-07-10",
      endDate: "2023-07-12",
    } as Occurrence,
  ]);

  const handleAddOccurrence = (newOccurrence: Occurrence) => {
    setOccurrences([...occurrences, newOccurrence]);
  };

  const handleEditOccurrence = (occurrence: Occurrence) => {
    setSelectedOccurrence(occurrence);
    setIsEditModalOpen(true);
  };

  const handleUpdateOccurrence = (updatedOccurrence: Occurrence) => {
    setOccurrences(
      occurrences.map((occurrence) =>
        occurrence.id === updatedOccurrence.id ? updatedOccurrence : occurrence
      )
    );
    setIsEditModalOpen(false);
    setSelectedOccurrence(null);
    toast.success("Ocorrência atualizada com sucesso");
  };

  const handleDeleteOccurrence = (occurrence: Occurrence) => {
    setSelectedOccurrence(occurrence);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOccurrence = () => {
    if (selectedOccurrence) {
      setOccurrences(
        occurrences.filter(
          (occurrence) => occurrence.id !== selectedOccurrence.id
        )
      );
      setIsDeleteModalOpen(false);
      setSelectedOccurrence(null);
      toast.success("Ocorrência excluída com sucesso");
    }
  };

  return (
    <Card className="bg-white h-full">
      <CardContent className="p-4 h-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Ocorrências</h2>
            <Button onClick={() => setIsOccurrenceFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Ocorrência
            </Button>
          </div>
          <OccurrencesDataTable
            data={occurrences}
            employees={employees}
            onEdit={handleEditOccurrence}
            onDelete={handleDeleteOccurrence}
          />
        </div>
        <OccurrenceFormModal
          isOpen={isOccurrenceFormOpen}
          onClose={() => setIsOccurrenceFormOpen(false)}
          onAddOccurrence={handleAddOccurrence}
          employees={employees}
        />
        <OccurrenceFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onAddOccurrence={handleUpdateOccurrence}
          employees={employees}
          initialData={selectedOccurrence}
        />
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteOccurrence}
          title="Confirmar Exclusão"
          message={"Tem certeza que deseja excluir esta ocorrência?"}
        />
      </CardContent>
    </Card>
  );
}
