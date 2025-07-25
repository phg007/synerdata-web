"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { TerminationObjectResponse } from "../../interfaces/termination-interfaces";

export const columns: ColumnDef<TerminationObjectResponse>[] = [
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
      <DataTableColumnHeader column={column} title="Data Demissão" />
    ),
    cell: ({ row }) => <span>{row.getValue("data")}</span>,
  },
  {
    accessorKey: "motivoInterno",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motivo Interno" />
    ),
    cell: ({ row }) => <span>{row.getValue("motivoInterno")}</span>,
    meta: {
      label: "Motivo Interno",
    },
  },
  {
    accessorKey: "motivoTrabalhista",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motivo Trabalhista" />
    ),
    cell: ({ row }) => <span>{row.getValue("motivoTrabalhista")}</span>,
    meta: {
      label: "Motivo Trabalhista",
    },
  },
  {
    accessorKey: "acaoTrabalhista",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ação Trabalhista" />
    ),
    cell: ({ row }) => <span>{row.getValue("acaoTrabalhista")}</span>,
    meta: {
      label: "Ação Trabalhista",
    },
  },
  {
    accessorKey: "formaDemissao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Forma de Demissão" />
    ),
    cell: ({ row }) => <span>{row.getValue("formaDemissao")}</span>,
    meta: {
      label: "Forma Demissão",
    },
  },
  {
    accessorKey: "criadoPor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado Por" />
    ),
    cell: ({ row }) => <span>{row.getValue("criadoPor")}</span>,
    meta: {
      label: "Criado Por",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
