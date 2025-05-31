"use client";

import type React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { RowActions } from "./row-actions";
import type { Department } from "@/app/api/company/department/interface";

interface DepartmentsDataTableProps {
  data: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export function DepartmentsDataTable({
  data,
  onEdit,
  onDelete,
}: DepartmentsDataTableProps): React.ReactElement {
  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div>
            {status === "A" ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Ativo
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Inativo
              </span>
            )}
          </div>
        );
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
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Criação" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        if (!date) return "-";

        // Format date as DD/MM/YYYY
        try {
          const formattedDate = new Date(date).toLocaleDateString("pt-BR");
          return formattedDate;
        } catch (e) {
          console.log(e);
          return date;
        }
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const department = row.original;
        return (
          <RowActions
            onEdit={() => onEdit(department)}
            onDelete={() => onDelete(department)}
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
      searchPlaceholder="Buscar departmento..."
      globalSearch={true}
      minWidth="800px"
      facetedFilterColumn="status"
      facetedFilterTitle="Status"
      facetedFilterOptions={[
        { label: "Ativo", value: "A" },
        { label: "Inativo", value: "I" },
      ]}
      exportFilename="departmentos-synerdata"
      DataTableViewOptions={DataTableViewOptions}
      DataTableFacetedFilter={DataTableFacetedFilter}
    />
  );
}
