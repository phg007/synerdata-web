"use client";

import { Table } from "@tanstack/react-table";
import { DownloadIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { exportDataToExcel } from "@/lib/export-to-excel";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  placeholder?: string;
  exportFileName?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchColumn = "numeroProcesso",
  placeholder = "Buscar ações trabalhistas...",
  exportFileName = "acoes-trabalhistas",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExport = () => {
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    exportDataToExcel(filteredData, exportFileName);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholder}
          value={
            (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
            aria-label="Limpar filtros"
          >
            Limpar
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={handleExport}
        >
          <DownloadIcon className="h-4 w-4" />
          Exportar
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
