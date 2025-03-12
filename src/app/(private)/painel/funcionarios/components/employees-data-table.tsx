"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { RowActions } from "./row-actions";
import type { Employee } from "@/components/employee-form-modal";

interface EmployeesDataTableProps {
  data: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeesDataTable({
  data,
  onEdit,
  onDelete,
}: EmployeesDataTableProps) {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Completo" />
      ),
    },
    {
      accessorKey: "cpf",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF" />
      ),
    },
    {
      accessorKey: "birthDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Nascimento" />
      ),
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cargo/Função" />
      ),
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Setor" />
      ),
      meta: {
        isSticky: true,
      },
    },
    {
      accessorKey: "contractType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de Contrato" />
      ),
    },
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salário" />
      ),
      cell: ({ row }) => {
        const salary = Number.parseFloat(row.getValue("salary"));
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(salary);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <RowActions
            onEdit={() => onEdit(employee)}
            onDelete={() => onDelete(employee)}
          />
        );
      },
    },
  ];

  const facetedFilterOptions = [
    { label: "TI", value: "TI" },
    { label: "Marketing", value: "Marketing" },
    { label: "Operações", value: "Operações" },
  ];

  const contractTypeFilterOptions = [
    { label: "CLT", value: "CLT" },
    { label: "PJ", value: "PJ" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="fullName"
      searchPlaceholder="Filtrar por nome..."
      minWidth="1200px"
      facetedFilterColumn="department"
      facetedFilterTitle="Setor"
      facetedFilterOptions={facetedFilterOptions}
      additionalFacetedFilters={[
        {
          column: "contractType",
          title: "Tipo de Contrato",
          options: contractTypeFilterOptions,
        },
      ]}
    />
  );
}
