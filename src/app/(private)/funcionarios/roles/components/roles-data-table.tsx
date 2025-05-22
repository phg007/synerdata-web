"use client";

import type React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { RowActions } from "./row-actions";
import type { Role } from "@/lib/role-service";

interface RolesDataTableProps {
  data: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RolesDataTable({
  data,
  onEdit,
  onDelete,
}: RolesDataTableProps): React.ReactElement {
  const columns: ColumnDef<Role>[] = [
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
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Criação" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
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
        const role = row.original;
        return (
          <RowActions
            onEdit={() => onEdit(role)}
            onDelete={() => onDelete(role)}
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
      searchPlaceholder="Buscar cargo..."
      globalSearch={true}
      minWidth="800px"
      facetedFilterColumn="status"
      facetedFilterTitle="Status"
      facetedFilterOptions={[
        { label: "Ativo", value: "A" },
        { label: "Inativo", value: "I" },
      ]}
      exportFilename="cargos-synerdata"
      DataTableViewOptions={DataTableViewOptions}
      DataTableFacetedFilter={DataTableFacetedFilter}
    />
  );
}
