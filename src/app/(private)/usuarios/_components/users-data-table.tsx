"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type React from "react";

import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { RowActions } from "./row-actions";
import type { User } from "@/components/user-form-modal";

interface UsersDataTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersDataTable({
  data,
  onEdit,
  onDelete,
}: UsersDataTableProps): React.ReactElement {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-mail" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "funcao",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Função" />
      ),

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
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),

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
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <RowActions
            onEdit={() => onEdit(user)}
            onDelete={() => onDelete(user)}
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
      searchPlaceholder="Buscar usuário..."
      globalSearch={true}
      facetedFilterColumn="funcao"
      facetedFilterTitle="Função"
      additionalFacetedFilters={[
        {
          column: "status",
          title: "Status",
        },
      ]}
      exportFilename="usuarios-synerdata"
      DataTableViewOptions={DataTableViewOptions}
      DataTableFacetedFilter={DataTableFacetedFilter}
    />
  );
}
