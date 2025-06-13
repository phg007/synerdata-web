"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { VacationObjectResponse } from "../../interfaces/vacation-interfaces";

export const columns: ColumnDef<VacationObjectResponse>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
  },
  {
    accessorFn: (row) => row.funcionario?.nome,
    id: "funcionario.nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funcionário" />
    ),
    cell: ({ row }) => <span>{row.getValue("funcionario.nome")}</span>,
  },
  {
    accessorKey: "dataInicio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Início das Férias" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataInicio")}</span>,
  },
  {
    accessorKey: "dataFim",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fim das Férias" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataFim")}</span>,
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
