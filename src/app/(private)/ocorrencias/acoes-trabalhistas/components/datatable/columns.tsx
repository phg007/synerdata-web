"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { LaborActionObjectResponse } from "../../interfaces/labor-action";

export const columns: ColumnDef<LaborActionObjectResponse>[] = [
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
    accessorKey: "numeroProcesso",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nº Processo" />
    ),
    cell: ({ row }) => <span>{row.getValue("numeroProcesso")}</span>,
  },
  {
    accessorKey: "tribunal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tribunal" />
    ),
    cell: ({ row }) => <span>{row.getValue("tribunal")}</span>,
  },
  {
    accessorKey: "dataAjuizamento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Ajuizamento" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataAjuizamento")}</span>,
  },
  {
    accessorKey: "reclamante",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reclamante" />
    ),
    cell: ({ row }) => <span>{row.getValue("reclamante")}</span>,
  },
  {
    accessorKey: "reclamado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reclamado" />
    ),
    cell: ({ row }) => <span>{row.getValue("reclamado")}</span>,
  },
  {
    accessorKey: "advogadoReclamante",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adv. Reclamante" />
    ),
    cell: ({ row }) => <span>{row.getValue("advogadoReclamante")}</span>,
  },
  {
    accessorKey: "advogadoReclamado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adv. Reclamado" />
    ),
    cell: ({ row }) => <span>{row.getValue("advogadoReclamado")}</span>,
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => <span>{row.getValue("descricao")}</span>,
  },
  {
    accessorKey: "valorCausa",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor da Causa" />
    ),
    cell: ({ row }) => <span>{row.getValue("valorCausa")}</span>,
  },
  {
    accessorKey: "andamento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Andamento" />
    ),
    cell: ({ row }) => <span>{row.getValue("andamento")}</span>,
  },
  {
    accessorKey: "decisao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Decisão" />
    ),
    cell: ({ row }) => <span>{row.getValue("decisao")}</span>,
  },
  {
    accessorKey: "dataConclusao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Conclusão" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataConclusao")}</span>,
  },
  {
    accessorKey: "recursos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recursos" />
    ),
    cell: ({ row }) => <span>{row.getValue("recursos")}</span>,
  },
  {
    accessorKey: "custasDespesas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Custas/Despesas" />
    ),
    cell: ({ row }) => <span>{row.getValue("custasDespesas")}</span>,
  },
  {
    accessorKey: "dataConhecimento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Conhecimento" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataConhecimento")}</span>,
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
