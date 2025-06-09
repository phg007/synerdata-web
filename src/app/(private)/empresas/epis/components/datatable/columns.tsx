"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { EpiObjectResponse } from "../../interfaces/epi-interfaces";

export const columns: ColumnDef<EpiObjectResponse>[] = [
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
    accessorKey: "criadoPor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado Por" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
