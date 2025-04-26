"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type React from "react";

import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { RowActions } from "./row-actions";
import type { Company } from "@/components/company-form-modal";

interface CompaniesDataTableProps {
  data: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompaniesDataTable({
  data,
  onEdit,
  onDelete,
}: CompaniesDataTableProps): React.ReactElement {
  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "nomeFantasia",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Fantasia" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "razaoSocial",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Razão Social" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cnpj",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CNPJ" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "cidade",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cidade" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "estado",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="UF" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "inscricaoEstadual",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inscrição Estadual" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "segmento",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Segmento" />
      ),
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, id, filterValue) => {
        const value = row.getValue(id) as string;
        return Array.isArray(filterValue)
          ? filterValue.includes(value)
          : value === filterValue;
      },
    },
    {
      accessorKey: "regimeTributario",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Regime Tributário" />
      ),
      cell: ({ row }) => {
        const regimeTributario = row.getValue("regimeTributario") as string;
        const regimeTributarioMap: Record<string, string> = {
          simples: "Simples Nacional",
          lucro_presumido: "Lucro Presumido",
          lucro_real: "Lucro Real",
        };
        return regimeTributarioMap[regimeTributario] || regimeTributario;
      },
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, id, filterValue) => {
        const value = row.getValue(id) as string;
        return Array.isArray(filterValue)
          ? filterValue.includes(value)
          : value === filterValue;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const company = row.original;
        return (
          <RowActions
            onEdit={() => onEdit(company)}
            onDelete={() => onDelete(company)}
          />
        );
      },
      enableHiding: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar empresa..."
      globalSearch={true}
      facetedFilterColumn="segmento"
      facetedFilterTitle="Segmento"
      additionalFacetedFilters={[
        {
          column: "regimeTributario",
          title: "Regime Tributário",
        },
      ]}
      exportFilename="empresas-synerdata"
      DataTableViewOptions={DataTableViewOptions}
      DataTableFacetedFilter={DataTableFacetedFilter}
    />
  );
}
