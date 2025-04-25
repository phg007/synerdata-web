"use client";

import type React from "react";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table as TanStackTable,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToExcel, prepareTableExport } from "@/lib/export-to-excel";
import { toast } from "sonner";

export interface DataTableFilterOption {
  column: string;
  title: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  minWidth?: string;
  facetedFilterColumn?: string;
  facetedFilterTitle?: string;
  additionalFacetedFilters?: DataTableFilterOption[];
  exportFilename?: string;
  globalSearch?: boolean;
  DataTableViewOptions: React.ComponentType<{ table: TanStackTable<TData> }>;
  DataTableFacetedFilter: React.ComponentType<{
    column: ReturnType<TanStackTable<TData>["getColumn"]> | undefined;
    title: string;
  }>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Filtrar...",
  minWidth,
  facetedFilterColumn,
  facetedFilterTitle,
  additionalFacetedFilters,
  exportFilename = "dados-exportados",
  globalSearch,
  DataTableViewOptions,
  DataTableFacetedFilter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Use a ref to track component mount state
  const isMounted = useRef(true);

  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleExportToCsv = useCallback(async (): Promise<void> => {
    try {
      setIsExporting(true);

      // Get visible columns and filtered rows
      const visibleColumns = table
        .getAllColumns()
        .filter((column) => column.getIsVisible() && column.id !== "actions");

      const filteredRows = table.getFilteredRowModel().rows;

      // Prepare data for export
      const { columns: exportColumns, data: exportData } = prepareTableExport(
        visibleColumns.map((col) => col.columnDef),
        filteredRows.map((row) => row.original)
      );

      // Export to CSV
      exportToExcel(exportColumns, exportData, exportFilename);

      // Only show toast if component is still mounted
      if (isMounted.current) {
        toast.success("Dados exportados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error);

      // Only show toast if component is still mounted
      if (isMounted.current) {
        toast.error("Erro ao exportar dados. Tente novamente.");
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsExporting(false);
      }
    }
  }, [table, exportFilename]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
    .overflow-x-auto::-webkit-scrollbar {
      height: 10px;
    }
    .overflow-x-auto::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 5px;
    }
    .overflow-x-auto::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
  `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2 flex-wrap gap-2">
          {searchColumn && !globalSearch && (
            <Input
              placeholder={searchPlaceholder}
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
          {facetedFilterColumn && facetedFilterTitle && (
            <DataTableFacetedFilter
              column={table.getColumn(facetedFilterColumn)}
              title={facetedFilterTitle}
            />
          )}
          {additionalFacetedFilters?.map((filter) => (
            <DataTableFacetedFilter
              key={filter.column}
              column={table.getColumn(filter.column)}
              title={filter.title}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={handleExportToCsv}
            disabled={isExporting}
          >
            <FileText className="h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <div className="relative">
          <div className="max-h-[calc(100vh-400px)] overflow-auto">
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
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </p>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={table.getState().pagination.pageSize.toString()}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">itens por página</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
