"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  formatCEP,
  formatCNPJ,
} from "@/app/(public)/pagamento/utils/checkout-utils";
import { BranchObjectResponse } from "../../interfaces/branch-interface";

export const columns: ColumnDef<BranchObjectResponse>[] = [
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
    accessorKey: "cnpj",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNPJ" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{formatCNPJ(row.getValue("cnpj"))}</span>
    ),
  },
  {
    accessorKey: "rua",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rua" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">{row.getValue("rua")}</span>
    ),
  },
  {
    accessorKey: "numero",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    cell: ({ row }) => <span>{row.getValue("numero")}</span>,
  },
  {
    accessorKey: "complemento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complemento" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">
        {row.getValue("complemento")}
      </span>
    ),
  },
  {
    accessorKey: "bairro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bairro" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">{row.getValue("bairro")}</span>
    ),
  },
  {
    accessorKey: "cidade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cidade" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">{row.getValue("cidade")}</span>
    ),
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => <span>{row.getValue("estado")}</span>,
  },
  {
    accessorKey: "cep",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CEP" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">
        {formatCEP(row.getValue("cep"))}
      </span>
    ),
  },
  {
    accessorKey: "dataFundacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Fundação" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataFundacao")}</span>,
  },
  {
    accessorKey: "telefone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefone" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">{row.getValue("telefone")}</span>
    ),
  },
  {
    accessorKey: "celular",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Celular" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">{row.getValue("celular")}</span>
    ),
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
