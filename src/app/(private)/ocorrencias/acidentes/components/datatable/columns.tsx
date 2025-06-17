"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { AcidentesObjectResponse } from "../../interfaces/accident-interfaces";

export const columns: ColumnDef<AcidentesObjectResponse>[] = [
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
    accessorFn: (row) => row.funcionario?.nome,
    id: "funcionario.nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funcionário" />
    ),
    cell: ({ row }) => (
      <div className="truncate font-medium">
        {" "}
        {row.getValue("funcionario.nome")}
      </div>
    ),
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">
        {row.getValue("descricao")}
      </span>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => <span>{row.getValue("data")}</span>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "natureza",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Natureza" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("natureza")}</span>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "cat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CAT" />
    ),
    cell: ({ row }) => <span className="truncate">{row.getValue("cat")}</span>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "medidasTomadas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medidas Tomadas" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">
        {row.getValue("medidasTomadas")}
      </span>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "criadoPor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado Por" />
    ),
    cell: ({ row }) => <span>{row.getValue("criadoPor")}</span>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
