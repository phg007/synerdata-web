"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { EpiDeliveryObjectResponse } from "../../interfaces/epi-delivery-interfaces";

export const columns: ColumnDef<EpiDeliveryObjectResponse>[] = [
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
    accessorFn: (row) => row.epis?.map((e) => e.nome).join(", "),
    id: "epis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EPI(s)" />
    ),
    cell: ({ row }) => <span>{row.getValue("epis")}</span>,
  },
  {
    accessorKey: "motivo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motivo" />
    ),
    cell: ({ row }) => <span>{row.getValue("motivo")}</span>,
  },
  {
    accessorKey: "entreguePor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entregue Por" />
    ),
    cell: ({ row }) => <span>{row.getValue("entreguePor")}</span>,
    meta: {
      label: "Entregue Por",
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data da Entrega" />
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
