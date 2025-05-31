"use client";

import type React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { RowActions } from "./row-actions";
import type { EPI } from "@/app/(private)/empresas/epis/services/epi-interfaces";

interface EPIsDataTableProps {
  data: EPI[];
}

export function EPIsDataTable({
  data,
}: EPIsDataTableProps): React.ReactElement {
  const columns: ColumnDef<EPI>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "descricao",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "equipamentos",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Equipamentos" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div>
            {status === "A" ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Ativo
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Inativo
              </span>
            )}
          </div>
        );
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
      accessorKey: "atualizadoEm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Atualizado Em" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const epi = row.original;
        return <RowActions epi={epi} />;
      },
      enableHiding: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar EPI..."
      globalSearch={true}
      minWidth="800px"
      facetedFilterColumn="status"
      facetedFilterTitle="Status"
      facetedFilterOptions={[
        { label: "Ativo", value: "A" },
        { label: "Inativo", value: "I" },
      ]}
      exportFilename="epis-synerdata"
      DataTableViewOptions={DataTableViewOptions}
      DataTableFacetedFilter={DataTableFacetedFilter}
    />
  );
}
