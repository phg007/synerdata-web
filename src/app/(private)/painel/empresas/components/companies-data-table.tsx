"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
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
}: CompaniesDataTableProps) {
  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "fantasyName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Fantasia" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "legalName",
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
      accessorKey: "segment",
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
      accessorKey: "taxRegime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Regime Tributário" />
      ),
      cell: ({ row }) => {
        const taxRegime = row.getValue("taxRegime") as string;
        const taxRegimeMap: Record<string, string> = {
          simples: "Simples Nacional",
          lucro_presumido: "Lucro Presumido",
          lucro_real: "Lucro Real",
        };
        return taxRegimeMap[taxRegime] || taxRegime;
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

  const segmentFacetedFilterOptions = [
    {
      label: "Desenvolvimento de Software",
      value: "Desenvolvimento de Software",
    },
    { label: "Energia Solar", value: "Energia Solar" },
    { label: "Alimentos Orgânicos", value: "Alimentos Orgânicos" },
  ];

  const taxRegimeFacetedFilterOptions = [
    { label: "Simples Nacional", value: "simples" },
    { label: "Lucro Presumido", value: "lucro_presumido" },
    { label: "Lucro Real", value: "lucro_real" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar empresa..."
      globalSearch={true}
      facetedFilterColumn="segment"
      facetedFilterTitle="Segmento"
      facetedFilterOptions={segmentFacetedFilterOptions}
      additionalFacetedFilters={[
        {
          column: "taxRegime",
          title: "Regime Tributário",
          options: taxRegimeFacetedFilterOptions,
        },
      ]}
      exportFilename="empresas-synerdata"
    />
  );
}
