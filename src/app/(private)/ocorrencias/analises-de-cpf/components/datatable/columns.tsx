"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { CpfAnalysisObjectResponse } from "../../interfaces/cpf-Analysis-interfaces";

export const columns: ColumnDef<CpfAnalysisObjectResponse>[] = [
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
