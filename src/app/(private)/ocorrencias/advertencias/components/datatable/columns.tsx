"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { WarningObjectResponse } from "../../interfaces/warning-interface";

export const columns: ColumnDef<WarningObjectResponse>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.funcionario?.nome,
    id: "funcionario.nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funcionário" />
    ),
    cell: ({ row }) => <span>{row.getValue("funcionario.nome")}</span>,
    meta: {
      label: "Funcionário",
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => <span>{row.getValue("data")}</span>,
  },
  {
    accessorKey: "motivo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motivo" />
    ),
    cell: ({ row }) => <span>{row.getValue("motivo")}</span>,
  },
  {
    accessorKey: "criadoPor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado Por" />
    ),
    cell: ({ row }) => <span>{row.getValue("criadoPor")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
