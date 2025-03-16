"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { RowActions } from "./row-actions";
import type { Employee } from "@/components/employee-form-modal";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

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
  // Extract unique departments and contract types for faceted filters
  const departments = useMemo(() => {
    const uniqueDepartments = new Set<string>();
    data.forEach((employee) => {
      if (employee.department) {
        uniqueDepartments.add(employee.department);
      }
    });
    return Array.from(uniqueDepartments).map((dept) => ({
      label: dept,
      value: dept,
    }));
  }, [data]);

  const contractTypes = useMemo(
    () => [
      { label: "CLT", value: "CLT" },
      { label: "PJ", value: "PJ" },
    ],
    []
  );

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
      accessorKey: "birthDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Nascimento" />
      ),
      cell: ({ row }) => {
        const birthDate = row.getValue("birthDate") as string;
        if (!birthDate) return "-";

        // Format date as DD/MM/YYYY
        try {
          const date = toZonedTime(new Date(birthDate), "America/Sao_Paulo");
          return format(date, "dd/MM/yyyy");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
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
      facetedFilterOptions={departments}
      additionalFacetedFilters={[
        {
          column: "contractType",
          title: "Tipo de Contrato",
          options: contractTypes,
        },
      ]}
      exportFilename="funcionarios-synerdata"
    />
  );
}
