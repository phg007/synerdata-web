import * as XLSX from "xlsx";
import type { ColumnDef } from "@tanstack/react-table";

/**
 * Interface para representar uma coluna para exportação
 */
export interface ExportColumn {
  id: string;
  header: string;
}

/**
 * Interface para representar os dados preparados para exportação
 */
export interface ExportData {
  columns: ExportColumn[];
  data: Record<string, unknown>[];
}

/**
 * Função para exportar dados para CSV
 * @param columns Configuração das colunas da tabela
 * @param data Dados a serem exportados
 * @param filename Nome do arquivo a ser baixado (sem extensão)
 */
export function exportToExcel<T>(
  columns: ExportColumn[],
  data: T[],
  filename = "export"
): void {
  try {
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row) => {
        const formattedRow: Record<string, unknown> = {};

        // Format each column according to its type
        columns.forEach((column) => {
          const value = (row as Record<string, unknown>)[column.id];

          // Skip undefined or null values
          if (value === undefined || value === null) {
            formattedRow[column.header] = "";
            return;
          }

          // Format based on value type
          if (typeof value === "number") {
            formattedRow[column.header] = value;
          } else if (typeof value === "boolean") {
            formattedRow[column.header] = value ? "Sim" : "Não";
          } else if (value instanceof Date) {
            formattedRow[column.header] = value.toLocaleDateString("pt-BR");
          } else if (typeof value === "object") {
            try {
              formattedRow[column.header] = JSON.stringify(value);
            } catch {
              formattedRow[column.header] = "";
            }
          } else {
            formattedRow[column.header] = value;
          }
        });

        return formattedRow;
      }),
      { header: columns.map((col) => col.header) }
    );

    // // Convert to CSV string with UTF-8 BOM for Excel compatibility
    // const csvContent = `\ufeff${XLSX.utils.sheet_to_csv(worksheet)}`;

    // // Create a Blob from the CSV string
    // const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // // Create a download link
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = `${filename}.csv`;
    // link.click();

    // // Clean up
    // setTimeout(() => {
    //   URL.revokeObjectURL(url);
    // }, 100);

    // Criar um workbook contendo a worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

    // Salvar o arquivo como .xlsx
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error("Error exporting to XLSX:", error);
    throw error;
  }
}

/**
 * Função auxiliar para extrair dados exportáveis da tabela TanStack
 * @param columns Colunas da tabela
 * @param rows Linhas da tabela
 * @returns Objeto com colunas e dados prontos para exportação
 */
export function prepareTableExport<T>(
  columns: ColumnDef<T, unknown>[],
  rows: T[]
): ExportData {
  // Prepare columns for export (only visible columns)
  const exportColumns: ExportColumn[] = columns
    .filter((column) => column.id !== "actions") // Exclude action columns
    .map((column) => {
      // Get the column title
      let header = "";

      // Try to get the title from the column definition
      if (typeof column.header === "string") {
        header = column.header;
      } else if (column.id) {
        // If not a string, use the column ID with first letter capitalized
        header = column.id.charAt(0).toUpperCase() + column.id.slice(1);
      } else {
        header = "Column";
      }

      return {
        id: column.id || "",
        header: header,
      };
    });

  // Prepare data for export
  const exportData: Record<string, unknown>[] = rows.map((row) => {
    const rowData: Record<string, unknown> = {};

    // For each column, get the cell value
    exportColumns.forEach((column) => {
      if (column.id) {
        // Get the raw value from the row
        const value = (row as Record<string, unknown>)[column.id];

        // Store the value in the export data
        rowData[column.id] = value;
      }
    });

    return rowData;
  });

  return { columns: exportColumns, data: exportData };
}

/**
 * Função para formatar valores para exibição no arquivo CSV
 * @param value Valor a ser formatado
 * @returns Valor formatado para exibição
 */
export function formatExcelValue(value: unknown): string | number | boolean {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("pt-BR");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  return String(value);
}

/**
 * Função simplificada para exportar dados diretamente
 * @param data Dados a serem exportados
 * @param filename Nome do arquivo a ser baixado (sem extensão)
 */
export function exportDataToExcel<T>(data: T[], filename = "export"): void {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array");
    }

    if (data.length === 0) {
      // Se não houver dados, crie um arquivo vazio
      const worksheet = XLSX.utils.json_to_sheet([]);
      const csvContent = `\ufeff${XLSX.utils.sheet_to_csv(worksheet)}`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      return;
    }

    // Extrair as chaves do primeiro objeto para usar como colunas
    const firstItem = data[0];
    const columns: ExportColumn[] = Object.keys(
      firstItem as Record<string, unknown>
    )
      .filter((key) => key !== "actions") // Excluir coluna de ações
      .map((key) => ({
        id: key,
        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalizar primeira letra
      }));

    // Chamar a função exportToExcel com as colunas extraídas
    exportToExcel(columns, data, filename);
  } catch (error) {
    console.error("Error exporting data to Excel:", error);
    throw error;
  }
}
