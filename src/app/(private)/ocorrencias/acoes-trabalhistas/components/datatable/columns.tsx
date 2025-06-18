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
      <span className="truncate font-medium">
        {row.getValue("funcionario.nome")}
      </span>
    ),
  },
  {
    accessorKey: "numeroProcesso",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nº Processo" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-nowrap">
        {row.getValue("numeroProcesso")}
      </span>
    ),
  },
  {
    accessorKey: "tribunal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tribunal" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">{row.getValue("tribunal")}</span>
    ),
  },
  {
    accessorKey: "dataAjuizamento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Ajuizamento" />
    ),
    cell: ({ row }) => {
      const data = row.getValue("dataAjuizamento") as string;
      return (
        <span className="text-nowrap">
          {new Date(data).toLocaleDateString("pt-BR")}
        </span>
      );
    },
  },
  {
    accessorKey: "reclamante",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reclamante" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("reclamante")}</span>
    ),
  },
  {
    accessorKey: "reclamado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reclamado" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("reclamado")}</span>
    ),
  },
  {
    accessorKey: "advogadoReclamante",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adv. Reclamante" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("advogadoReclamante")}</span>
    ),
  },
  {
    accessorKey: "advogadoReclamado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adv. Reclamado" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("advogadoReclamado")}</span>
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
  },
  {
    accessorKey: "valorCausa",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor da Causa" />
    ),
    cell: ({ row }) => {
      const valor = row.getValue("valorCausa") as number;
      return (
        <span className="text-nowrap font-medium">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valor)}
        </span>
      );
    },
  },
  {
    accessorKey: "andamento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Andamento" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">
        {row.getValue("andamento")}
      </span>
    ),
  },
  {
    accessorKey: "decisao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Decisão" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate">{row.getValue("decisao")}</span>
    ),
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
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("recursos")}</span>
    ),
  },
  {
    accessorKey: "custasDespesas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Custas/Despesas" />
    ),
    cell: ({ row }) => {
      const valor = row.getValue("custasDespesas") as number;
      return (
        <span className="text-nowrap font-medium">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valor)}
        </span>
      );
    },
  },
  {
    accessorKey: "dataConhecimento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Conhecimento" />
    ),
    cell: ({ row }) => <span>{row.getValue("dataConclusao")}</span>,
  },
  {
    accessorKey: "criadoPor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado Por" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("criadoPor")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
