"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type React from "react";

import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { RowActions } from "./row-actions";
import type { Occurrence } from "@/components/occurrence-form-modal";
import type { Employee } from "@/app/(private)/funcionarios/_components/employee-form-modal";

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
}: OccurrencesDataTableProps): React.ReactElement {
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
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, id, filterValue) => {
        const value = row.getValue(id) as string;
        return Array.isArray(filterValue)
          ? filterValue.includes(value)
          : value === filterValue;
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
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, id, filterValue) => {
        const value = row.getValue(id) as string;
        return Array.isArray(filterValue)
          ? filterValue.includes(value)
          : value === filterValue;
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("date" in occurrence && occurrence.date) return occurrence.date;
        if ("startDate" in occurrence && occurrence.startDate)
          return occurrence.startDate;
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, id, filterValue) => {
        const occurrence = row.original;

        // Usar type guard para verificar se a propriedade existe no objeto
        const getDateValue = (obj: Occurrence): string | undefined => {
          if ("date" in obj && obj.date) {
            return obj.date;
          } else if ("startDate" in obj && obj.startDate) {
            return obj.startDate;
          }
          return undefined;
        };

        const date = getDateValue(occurrence);

        if (!date) return false;

        return Array.isArray(filterValue)
          ? filterValue.includes(date)
          : date === filterValue;
      },
    },
    {
      accessorKey: "reason",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivo" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("reason" in occurrence && occurrence.reason)
          return occurrence.reason;
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Início" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("startDate" in occurrence && occurrence.startDate)
          return occurrence.startDate;
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Fim" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("endDate" in occurrence && occurrence.endDate)
          return occurrence.endDate;
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "newPosition",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nova Função" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("newPosition" in occurrence && occurrence.newPosition)
          return occurrence.newPosition;
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "newSalary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Novo Salário" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("newSalary" in occurrence && occurrence.newSalary) {
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(occurrence.newSalary);
        }
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "dismissalType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de Demissão" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("dismissalType" in occurrence && occurrence.dismissalType) {
          const dismissalTypeMap: Record<string, string> = {
            voluntaria: "Voluntária",
            justa_causa: "Justa Causa",
            sem_justa_causa: "Sem Justa Causa",
          };
          return (
            dismissalTypeMap[occurrence.dismissalType] ||
            occurrence.dismissalType
          );
        }
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "acquisitionPeriod",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Período Aquisitivo" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("acquisitionPeriod" in occurrence && occurrence.acquisitionPeriod)
          return occurrence.acquisitionPeriod;
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cpfStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status CPF" />
      ),
      cell: ({ row }) => {
        const occurrence = row.original;
        if ("cpfStatus" in occurrence && occurrence.cpfStatus) {
          return occurrence.cpfStatus === "regular" ? "Regular" : "Irregular";
        }
        return "-";
      },
      enableSorting: true,
      enableHiding: true,
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
      enableHiding: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar ocorrência..."
      globalSearch={true}
      facetedFilterColumn="type"
      facetedFilterTitle="Tipo de Ocorrência"
      additionalFacetedFilters={[
        {
          column: "employeeId",
          title: "Funcionário",
        },
        {
          column: "date",
          title: "Data",
        },
      ]}
      minWidth="1800px"
      exportFilename="ocorrencias-synerdata"
      DataTableViewOptions={DataTableViewOptions}
      DataTableFacetedFilter={DataTableFacetedFilter}
    />
  );
}
