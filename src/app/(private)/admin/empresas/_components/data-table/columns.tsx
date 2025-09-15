"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { CompanyWithStatsObjectResponse } from "../../_services/get-companies-with-stats";
import { formatCNPJ } from "@/app/(public)/pagamento/utils/checkout-utils";

export const columns: ColumnDef<CompanyWithStatsObjectResponse>[] = [
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
    accessorKey: "nomeFantasia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome Fantasia" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.getValue("nomeFantasia")}
      </span>
    ),
  },
  {
    accessorKey: "razaoSocial",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Razão Social" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.getValue("razaoSocial")}
      </span>
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
    accessorKey: "quantidadeUsuarios",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qt. Usuários" />
    ),
    cell: ({ row }) => <span>{row.getValue("quantidadeUsuarios")}</span>,
  },
  {
    accessorKey: "quantidadeFuncionarios",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qt. Funcionários" />
    ),
    cell: ({ row }) => <span>{row.getValue("quantidadeFuncionarios")}</span>,
  },
  {
    accessorKey: "plano",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plano" />
    ),
    cell: ({ row }) => <span>{row.getValue("plano")}</span>,
  },
  {
    accessorKey: "statusAssinatura",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status Assinatura" />
    ),
    cell: ({ row }) => <span>{row.getValue("statusAssinatura")}</span>,
  },
  {
    accessorKey: "pbUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Url PB" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("pbUrl") as string;
      if (!url) return <span>-</span>;

      const displayUrl = url.length > 20 ? `${url.substring(0, 30)}...` : url;

      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {displayUrl}
        </a>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue("status")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
