"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { EmployeeObjectResponse } from "../../interfaces/employee-interface";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<EmployeeObjectResponse>[] = [
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
    accessorKey: "cpf",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPF" />
    ),
    cell: ({ row }) => {
      const cpf = row.getValue("cpf") as string;
      const formattedCPF = cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
      return (
        <span className="text-nowrap font-mono text-sm">{formattedCPF}</span>
      );
    },
  },
  {
    id: "funcao",
    accessorFn: (row) => row.funcao.nome,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Função" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("funcao")}</span>
    ),
  },
  {
    id: "setor",
    accessorFn: (row) => row.setor.nome,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Setor" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("setor")}</span>
    ),
  },
  {
    accessorKey: "regimeContratacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Regime" />
    ),
    cell: ({ row }) => {
      const regime = row.getValue("regimeContratacao") as string;
      const regimeMap = {
        CLT: { label: "CLT", variant: "default" as const },
        ESTAGIARIO: { label: "Estágio", variant: "secondary" as const },
        TERCEIRIZADO: { label: "Terceirizado", variant: "outline" as const },
        AUTONOMO: { label: "Autônomo", variant: "secondary" as const },
        PJ: { label: "PJ", variant: "outline" as const },
      };

      const regimeInfo = regimeMap[regime as keyof typeof regimeMap] || {
        label: regime,
        variant: "default" as const,
      };

      return <Badge variant={regimeInfo.variant}>{regimeInfo.label}</Badge>;
    },
  },
  {
    accessorKey: "salario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salário" />
    ),
    cell: ({ row }) => {
      const salario = row.getValue("salario") as number;
      return (
        <span className="text-nowrap font-medium">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(salario)}
        </span>
      );
    },
  },
  {
    accessorKey: "dataAdmissao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Admissão" />
    ),
    cell: ({ row }) => {
      const data = row.getValue("dataAdmissao") as string;
      const dataFormatada = new Date(data).toLocaleDateString("pt-BR");
      return <span className="text-nowrap">{dataFormatada}</span>;
    },
  },
  {
    accessorKey: "escala",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Escala" />
    ),
    cell: ({ row }) => {
      const escala = row.getValue("escala") as string;
      const escalaMap = {
        SEGUNDA_A_SEXTA: "Seg-Sex",
        SEGUNDA_A_SABADO: "Seg-Sáb",
        ESCALA_6X1: "6x1",
        ESCALA_12X36: "12x36",
        TURNO_REVEZAMENTO: "Revezamento",
      };

      const escalaLabel = escalaMap[escala as keyof typeof escalaMap] || escala;

      return (
        <Badge variant="outline" className="text-xs">
          {escalaLabel}
        </Badge>
      );
    },
  },
  {
    accessorKey: "cargaHoraria",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Carga Horária" />
    ),
    cell: ({ row }) => {
      const carga = row.getValue("cargaHoraria") as number;
      return <span className="text-nowrap">{carga}h/sem</span>;
    },
  },
  {
    accessorKey: "celular",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Celular" />
    ),
    cell: ({ row }) => {
      const celular = row.getValue("celular") as string;
      // Formatar celular: (00) 00000-0000
      const formattedCelular = celular.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
      );
      return (
        <span className="text-nowrap font-mono text-sm">
          {formattedCelular}
        </span>
      );
    },
  },
  {
    accessorKey: "necessidadesEspeciais",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PCD" />
    ),
    cell: ({ row }) => {
      const necessidades = row.getValue("necessidadesEspeciais") as boolean;
      return necessidades ? (
        <Badge variant="secondary" className="text-xs">
          PCD
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      );
    },
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
