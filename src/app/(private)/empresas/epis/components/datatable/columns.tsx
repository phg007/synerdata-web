"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { GetEpiResponseData } from "../../services/epi-interfaces";

export const columns: ColumnDef<GetEpiResponseData>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    // cell: ({ row }) => <div className="text-nowrap">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "equipamentos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipamentos" />
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
    accessorKey: "atualizadoEm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Atualizado Em" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
