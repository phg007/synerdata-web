"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
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
        const date = occurrence.date || occurrence.startDate;
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

  // Expanded faceted filter options for all columns
  const typeFacetedFilterOptions = [
    { label: "Falta", value: "falta" },
    { label: "Atestado", value: "atestado" },
    { label: "Promoção", value: "promocao" },
    { label: "Demissão", value: "demissao" },
    { label: "Férias", value: "ferias" },
    { label: "Análise de CPF", value: "analiseCPF" },
    { label: "Acidente", value: "acidente" },
    { label: "Atualização de Projeto", value: "atualizacaoProjeto" },
    { label: "Advertência", value: "advertencia" },
    { label: "Ação Trabalhista", value: "acaoTrabalhista" },
    { label: "EPI", value: "epi" },
  ];

  // Create employee filter options from the employees data
  const employeeFacetedFilterOptions = employees.map((employee) => ({
    label: employee.fullName,
    value: employee.id,
  }));

  // Extract unique dates from occurrences for date filtering
  const getUniqueDates = () => {
    const dates = new Set<string>();

    data.forEach((occurrence) => {
      if ("date" in occurrence && occurrence.date) {
        dates.add(occurrence.date);
      }
      if ("startDate" in occurrence && occurrence.startDate) {
        dates.add(occurrence.startDate);
      }
    });

    return Array.from(dates).map((date) => ({
      label: date,
      value: date,
    }));
  };

  const dateFacetedFilterOptions = getUniqueDates();

  // Add a default option if no dates are found
  const dateOptions =
    dateFacetedFilterOptions.length > 0
      ? dateFacetedFilterOptions
      : [{ label: "Sem datas disponíveis", value: "" }];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar ocorrência..."
      globalSearch={true}
      facetedFilterColumn="type"
      facetedFilterTitle="Tipo de Ocorrência"
      facetedFilterOptions={typeFacetedFilterOptions}
      additionalFacetedFilters={[
        {
          column: "employeeId",
          title: "Funcionário",
          options: employeeFacetedFilterOptions,
        },
        {
          column: "date",
          title: "Data",
          options: dateOptions,
        },
      ]}
      minWidth="1800px"
      exportFilename="ocorrencias-synerdata"
    />
  );
}
