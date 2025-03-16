"use client";

import type React from "react";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
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
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { exportToExcel } from "@/lib/export-to-excel";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  minWidth?: string;
  facetedFilterColumn?: string;
  facetedFilterTitle?: string;
  facetedFilterOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  additionalFacetedFilters?: {
    column: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  exportFilename?: string;
  globalSearch?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Filtrar...",
  minWidth,
  facetedFilterColumn,
  facetedFilterTitle,
  facetedFilterOptions,
  additionalFacetedFilters,
  exportFilename = "dados-exportados",
  globalSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
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

  const handleExportToExcel = () => {
    try {
      // Preparar colunas para exportação (apenas colunas visíveis)
      const exportColumns = table
        .getAllColumns()
        .filter((column) => column.getIsVisible())
        .map((column) => {
          // Obter o título da coluna
          let header = "";

          // Tentar obter o título da definição da coluna
          if (typeof column.columnDef.header === "string") {
            header = column.columnDef.header;
          } else if (column.columnDef.header) {
            // Se não for uma string, usar o ID da coluna com primeira letra maiúscula
            header = column.id.charAt(0).toUpperCase() + column.id.slice(1);
          } else {
            header = column.id.charAt(0).toUpperCase() + column.id.slice(1);
          }

          return {
            id: column.id,
            header: header,
          };
        });

      // Preparar dados para exportação (apenas dados filtrados)
      const exportData = table.getFilteredRowModel().rows.map((row) => {
        const rowData: Record<string, unknown> = {};

        // Para cada coluna visível, obter o valor da célula
        exportColumns.forEach((column) => {
          const cell = row
            .getAllCells()
            .find((cell) => cell.column.id === column.id);
          if (cell) {
            // Obter o valor bruto da célula
            rowData[column.id] = row.getValue(column.id);

            // Para colunas com formatação especial (como moeda), tentar obter o valor formatado
            if (
              cell.column.columnDef.cell &&
              typeof cell.column.columnDef.cell !== "string"
            ) {
              try {
                const renderedValue = cell.renderValue();
                if (
                  renderedValue !== null &&
                  renderedValue !== undefined &&
                  typeof renderedValue !== "object"
                ) {
                  rowData[column.id] = renderedValue;
                }
              } catch (e) {
                console.log(e);
                // Se não conseguir obter o valor renderizado, manter o valor bruto
              }
            }
          } else {
            rowData[column.id] = "";
          }
        });

        return rowData;
      });

      // Exportar para Excel
      exportToExcel(exportColumns, exportData, exportFilename);
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados. Tente novamente.");
    }
  };

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
              value={(table.getState().globalFilter as string) ?? ""}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
              }}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          )}
          {facetedFilterColumn &&
            facetedFilterTitle &&
            facetedFilterOptions && (
              <DataTableFacetedFilter
                column={table.getColumn(facetedFilterColumn)}
                title={facetedFilterTitle}
                options={facetedFilterOptions}
              />
            )}
          {additionalFacetedFilters?.map((filter) => (
            <DataTableFacetedFilter
              key={filter.column}
              column={table.getColumn(filter.column)}
              title={filter.title}
              options={filter.options}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={handleExportToExcel}
          >
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table style={minWidth ? { minWidth } : undefined}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.columnDef.meta?.isSticky
                          ? "sticky left-0 z-10 bg-background"
                          : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.columnDef.meta?.isSticky
                          ? "sticky left-0 z-10 bg-white"
                          : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
              <SelectValue placeholder={table.getState().pagination.pageSize} />
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
