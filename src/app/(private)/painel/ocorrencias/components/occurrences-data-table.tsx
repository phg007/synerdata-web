"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
// Atualize os imports para usar os componentes locais
import { DataTableColumnHeader } from "./data-table-column-header";
import { RowActions } from "./row-actions";
import type { Occurrence } from "@/components/occurrence-form-modal";
import type { Employee } from "@/components/employee-form-modal";

interface OccurrencesDataTableProps {
  data: Occurrence[];
  employees: Employee[];
  onEdit: (occurrence: Occurrence) => void;
  onDelete: (occurrence: Occurrence) => void;
}

export function OccurrencesDataTable({
  data,
  employees,
  onEdit,
  onDelete,
}: OccurrencesDataTableProps) {
  const columns: ColumnDef<Occurrence>[] = [
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ row }) => {
        const typeMap: Record<string, string> = {
          falta: "Falta",
          atestado: "Atestado",
          promocao: "Promoção",
          demissao: "Demissão",
          analiseCPF: "Análise de CPF",
          acidente: "Acidente",
          atualizacaoProjeto: "Atualização de Projeto",
          advertencia: "Advertência",
          acaoTrabalhista: "Ação Trabalhista",
          epi: "EPI",
          ferias: "Férias",
        };
        const type = row.getValue("type") as string;
        return typeMap[type] || type;
      },
    },
    {
      accessorKey: "employeeId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Funcionário" />
      ),
      cell: ({ row }) => {
        const employeeId = row.getValue("employeeId") as string;
        const employee = employees.find((e) => e.id === employeeId);
        return employee?.fullName || employeeId;
      },
    },
    {
      id: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("date" in occurrence) return occurrence.date;
        if ("startDate" in occurrence) return occurrence.startDate;
        return "-";
      },
    },
    {
      id: "details",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Detalhes" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;

        switch (occurrence.type) {
          case "falta":
            return `Motivo: ${occurrence.reason}`;
          case "promocao":
            return `Nova função: ${occurrence.newPosition}, Novo salário: ${occurrence.newSalary}`;
          case "ferias":
            return `Período aquisitivo: ${occurrence.acquisitionPeriod}`;
          case "atestado":
            return `De ${occurrence.startDate} até ${occurrence.endDate}`;
          case "demissao":
            return `Motivo: ${occurrence.reason}, Tipo: ${occurrence.dismissalType}`;
          default:
            return "-";
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const occurrence = row.original;
        return (
          <RowActions
            onEdit={() => onEdit(occurrence)}
            onDelete={() => onDelete(occurrence)}
          />
        );
      },
    },
  ];

  const typeFacetedFilterOptions = [
    { label: "Falta", value: "falta" },
    { label: "Atestado", value: "atestado" },
    { label: "Promoção", value: "promocao" },
    { label: "Demissão", value: "demissao" },
    { label: "Férias", value: "ferias" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="employeeId"
      searchPlaceholder="Filtrar por funcionário..."
      facetedFilterColumn="type"
      facetedFilterTitle="Tipo de Ocorrência"
      facetedFilterOptions={typeFacetedFilterOptions}
    />
  );
}
