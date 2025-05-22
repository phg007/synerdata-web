"use client";

import type React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "../datatable/data-table-column-header";
import { DataTableViewOptions } from "../datatable/data-table-view-options";
import { DataTableFacetedFilter } from "../datatable/data-table-faceted-filter";
import { RowActions } from "./row-actions";
import type { Employee } from "@/app/(private)/funcionarios/_components/employee-form-modal";

interface EmployeesDataTableProps {
  data: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeesDataTable({
  data,
  onEdit,
  onDelete,
}: EmployeesDataTableProps): React.ReactElement {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Completo" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cpf",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "carteiraIdentidade",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="RG" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "birthDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Nascimento" />
      ),
      cell: ({ row }) => {
        const birthDate = row.getValue("birthDate") as string;
        if (!birthDate) return "-";

        // Format date as DD/MM/YYYY
        try {
          const date = new Date(birthDate);
          return date.toLocaleDateString("pt-BR");
        } catch (e) {
          console.log(e);
          return birthDate;
        }
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cargo/Função" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Setor" />
      ),
      cell: ({ row }) => {
        const department = row.getValue("department") as string;
        return department;
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
      accessorKey: "contractType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de Contrato" />
      ),
      cell: ({ row }) => {
        const contractType = row.getValue("contractType") as string;
        return contractType;
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
      accessorKey: "dataAdmissao",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Admissão" />
      ),
      cell: ({ row }) => {
        const dataAdmissao = row.getValue("dataAdmissao") as string;
        if (!dataAdmissao) return "-";

        // Format date as DD/MM/YYYY
        try {
          const date = new Date(dataAdmissao);
          return date.toLocaleDateString("pt-BR");
        } catch (e) {
          console.log(e);
          return dataAdmissao;
        }
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salário" />
      ),
      cell: ({ row }) => {
        const salary = Number.parseFloat(row.getValue("salary") as string);
        // Format as Brazilian currency
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(salary);
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "empresa",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Empresa" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "projectOrCostCenter",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Projeto/Centro de Custo"
        />
      ),
      enableSorting: true,
      enableHiding: true,
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
      enableHiding: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar funcionário..."
      globalSearch={true}
      minWidth="1200px"
      facetedFilterColumn="department"
      facetedFilterTitle="Setor"
      additionalFacetedFilters={[
        {
          column: "contractType",
          title: "Tipo de Contrato",
        },
      ]}
      exportFilename="funcionarios-synerdata"
      DataTableViewOptions={DataTableViewOptions}
      DataTableFacetedFilter={DataTableFacetedFilter}
    />
  );
}
