"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ProjectObjectResponse } from "../../interfaces/project-interface";

export const columns: ColumnDef<ProjectObjectResponse>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="text-nowrap">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">{row.getValue("nome")}</span>
    ),
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => <span>{row.getValue("descricao")}</span>,
    meta: {
      label: "Descrição",
    },
  },
  {
    accessorKey: "dataInicio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Início" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataInicio")}</span>,
    meta: {
      label: "Data Início",
    },
  },
  {
    accessorKey: "cno",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNO" />
    ),
    cell: ({ row }) => <span>{row.getValue("cno")}</span>,
  },
  {
    accessorKey: "criadoPor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado por" />
    ),
    cell: ({ row }) => <span>{row.getValue("criadoPor")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
