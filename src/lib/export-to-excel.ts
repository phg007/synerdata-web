/**
 * Função para exportar dados para Excel (CSV)
 * @param columns Colunas da tabela
 * @param data Dados a serem exportados
 * @param filename Nome do arquivo a ser baixado
 */
export function exportToExcel<T>(
  columns: { id: string; header: string }[],
  data: T[],
  filename = "export"
): void {
  // Cabeçalhos das colunas
  const headers = columns.map((column) => column.header);

  // Mapear os dados para o formato CSV
  const csvData = data.map((row) => {
    return columns
      .map((column) => {
        // Obter o valor da coluna para esta linha
        const value = (row as never)[column.id];

        // Tratar valores especiais
        if (value === null || value === undefined) return "";

        // Converter objetos para string JSON
        if (typeof value === "object" && value !== null) {
          try {
            
            return JSON.stringify(value).replace(/"/g, '""');// eslint-disable-line
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            return "";
          }
        }

        // Converter números para string
        if (typeof value === "number") {
          return String(value);
        }

        // Converter booleanos para string
        if (typeof value === "boolean") {
          return value ? "Sim" : "Não";
        }

        // Escapar aspas duplas e envolver em aspas se contiver vírgulas, quebras de linha ou aspas
        const stringValue = String(value);
        const escapedValue = stringValue.replace(/"/g, '""');// eslint-disable-line
        if (
          escapedValue.includes(",") ||
          escapedValue.includes("\n") ||
          escapedValue.includes('"')// eslint-disable-line
        ) {
          return `"${escapedValue}"`;
        }
        return escapedValue;
      })
      .join(",");
  });

  // Juntar cabeçalhos e dados
  const csvContent = [headers.join(","), ...csvData].join("\n");

  // Criar um Blob com o conteúdo CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Criar um link para download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Liberar o URL criado
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
