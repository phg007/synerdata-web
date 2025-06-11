"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { AcidentesObjectResponse } from "../../interfaces/accidents-interfaces";

export const columns: ColumnDef<AcidentesObjectResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "funcionario.nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funcionário" />
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
    enableHiding: false,
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "natureza",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Natureza" />
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "cat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cat" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "medidasTomadas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medidas Tomadas" />
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
