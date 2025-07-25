"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { PromotionObjectResponse } from "../../interfaces/promotion-interfaces";

export const columns: ColumnDef<PromotionObjectResponse>[] = [
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
    accessorFn: (row) => row.funcao?.nome,
    id: "funcao.nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nova Função" />
    ),
    cell: ({ row }) => <span>{row.getValue("funcao.nome")}</span>,
    meta: {
      label: "Função",
    },
  },
  {
    accessorKey: "salario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salário" />
    ),
    cell: ({ row }) => <span>R$ {row.getValue("salario")}</span>,
    meta: {
      label: "Salário",
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data da Promoção" />
    ),
    cell: ({ row }) => <span>{row.getValue("data")}</span>,
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
