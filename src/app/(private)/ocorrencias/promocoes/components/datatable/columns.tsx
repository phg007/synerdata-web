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
    accessorFn: (row) => row.funcao?.nome,
    id: "funcao.nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nova Função" />
    ),
    cell: ({ row }) => <span>{row.getValue("funcao.nome")}</span>,
  },
  {
    accessorKey: "salario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salário" />
    ),
    cell: ({ row }) => <span>R$ {row.getValue("salario")}</span>,
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
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
