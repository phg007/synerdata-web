"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table as ReactTable,
  type Column,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DownloadIcon } from "lucide-react";
import { exportDataToExcel } from "@/lib/export-to-excel";

interface DataTableViewOptionsProps<TData> {
  table: ReactTable<TData>;
}

interface DataTableFacetedFilterProps<TData> {
  column: Column<TData, unknown>;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  facetedFilterColumn?: string;
  facetedFilterTitle?: string;
  facetedFilterOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  exportFilename?: string;
  minWidth?: string;
  globalSearch?: boolean;
  DataTableViewOptions?: React.ComponentType<DataTableViewOptionsProps<TData>>;
  DataTableFacetedFilter?: React.ComponentType<
    DataTableFacetedFilterProps<TData>
  >;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder,
  facetedFilterColumn,
  facetedFilterTitle,
  facetedFilterOptions = [],
  exportFilename,
  minWidth,
  globalSearch,
  DataTableViewOptions,
  DataTableFacetedFilter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable<TData>({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  // Função para exportar os dados filtrados da tabela
  const handleExport = () => {
    // Obter apenas os dados filtrados e visíveis
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    exportDataToExcel(filteredData, exportFilename || "export");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {searchColumn && !globalSearch && (
            <Input
              placeholder={searchPlaceholder || "Filtrar..."}
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}

          {globalSearch && (
            <Input
              placeholder={searchPlaceholder || "Buscar em todas as colunas..."}
              value={globalFilter ?? ""}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
              }}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}

          {facetedFilterColumn &&
            facetedFilterTitle &&
            DataTableFacetedFilter && (
              <DataTableFacetedFilter
                column={
                  table.getColumn(facetedFilterColumn) as Column<TData, unknown>
                }
                title={facetedFilterTitle}
                options={facetedFilterOptions}
              />
            )}
        </div>
        <div className="flex items-center space-x-2">
          {exportFilename && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={handleExport}
            >
              <DownloadIcon className="h-4 w-4" />
              Exportar
            </Button>
          )}
          {DataTableViewOptions && <DataTableViewOptions table={table} />}
        </div>
      </div>
      <div className="rounded-md border">
        <div className="relative max-h-[calc(100vh-400px)] overflow-auto">
          <table
            className="w-full table-auto"
            style={minWidth ? { minWidth } : undefined}
          >
            <thead className="bg-white sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">itens por página</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para página anterior</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para próxima página</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
