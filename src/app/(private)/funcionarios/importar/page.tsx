"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  UploadIcon,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "./_components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { downloadTemplate } from "./_services/download-template";
import {
  importEmployees,
  ImportResult,
  ImportError,
  ErrorData,
} from "./_services/import-employees";
import { useSession } from "next-auth/react";

const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 15 * 1024 * 1024,
      "Arquivo deve ter no máximo 15MB"
    )
    .refine(
      (file) => file.name.endsWith(".xlsx"),
      "Apenas arquivos .xlsx são aceitos"
    )
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Tipo de arquivo inválido"
    ),
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;

export default function ImportFilePage() {
  const { data: session } = useSession();
  const companyId = session?.user?.empresa;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);

  const { mutateAsync: downloadTemplateFn, isPending } = useMutation({
    mutationFn: downloadTemplate,
    onSuccess: async (res: Response) => {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const cd = res.headers.get("Content-Disposition") || "";
      const match = /filename="?([^"]+)"?/.exec(cd);
      const filename = match?.[1] ?? "template-funcionarios.xlsx";

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Template baixado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao obter o template", {
        description: error.message,
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => importEmployees(companyId!, file),
    onSuccess: (data) => {
      setImportResult(data);
      setImportErrors([]);
      toast.success("Importação concluída com sucesso!");
    },
    onError: (error: {
      status?: number;
      data?: ErrorData;
      message?: string;
    }) => {
      if (error.status === 400 && error.data?.errors) {
        setImportErrors(error.data.errors);
        toast.error("Erros de validação encontrados", {
          description: `${error.data.errors.length} problema(s) encontrado(s) na planilha`,
        });
      } else if (error.status === 415) {
        toast.error("Formato de arquivo inválido", {
          description: "Apenas arquivos .xlsx são aceitos",
        });
      } else if (error.status === 413) {
        toast.error("Arquivo muito grande", {
          description: "O arquivo deve ter no máximo 15MB",
        });
      } else {
        toast.error("Erro na importação", {
          description: error.message || "Ocorreu um erro inesperado",
        });
      }
      setImportResult(null);
    },
  });

  const handleImport = () => {
    if (!selectedFile || !companyId) return;

    try {
      fileUploadSchema.parse({ file: selectedFile });
      importMutation.mutate(selectedFile);
    } catch {
      toast.error("Arquivo inválido");
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setImportResult(null);
    setImportErrors([]);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/funcionarios">
                  Funcionários
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Importar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/funcionarios">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 pt-0">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UploadIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Importar funcionários
                </h1>
                <p className="text-gray-600">
                  Envie uma planilha com os dados dos funcionários
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Upload da Planilha</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>
                    Selecione um arquivo .xlsx com os dados dos funcionários
                  </span>
                  <Button
                    variant="link"
                    onClick={() => downloadTemplateFn()}
                    disabled={isPending}
                    className="p-0 h-auto text-purple-600 hover:text-purple-700 ml-2"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar template
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUploader
                  onFileSelected={setSelectedFile}
                  disabled={importMutation.isPending}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleImport}
                    disabled={
                      !selectedFile || !companyId || importMutation.isPending
                    }
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {importMutation.isPending
                      ? "Importando..."
                      : "Importar Funcionários"}
                  </Button>

                  {(importResult || importErrors.length > 0) && (
                    <Button variant="outline" onClick={resetState}>
                      Nova Importação
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {importResult && (
              <Card className="mb-6 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    Importação Concluída
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {importResult.totalRows}
                      </div>
                      <div className="text-sm text-blue-700">
                        Total de Linhas
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {importResult.inserted}
                      </div>
                      <div className="text-sm text-green-700">Inseridos</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {importResult.updated}
                      </div>
                      <div className="text-sm text-yellow-700">Atualizados</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">
                        {importResult.skipped}
                      </div>
                      <div className="text-sm text-gray-700">Ignorados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {importErrors.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    Erros de Validação ({importErrors.length} erros encontrados)
                  </CardTitle>
                  <CardDescription>
                    Corrija os erros abaixo e tente novamente. Os dados estão
                    sendo interpretados incorretamente pelo sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800 mb-2">
                        📋 Resumo dos Problemas:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-700">
                            <strong>
                              {new Set(importErrors.map((e) => e.row)).size}
                            </strong>{" "}
                            linhas com erros
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-red-700">
                            <strong>
                              {new Set(importErrors.map((e) => e.field)).size}
                            </strong>{" "}
                            campos diferentes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-red-700">
                            <strong>
                              {
                                importErrors.filter((e) =>
                                  e.message.includes("must be a string")
                                ).length
                              }
                            </strong>{" "}
                            problemas de formato
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">
                        💡 Dica Importante:
                      </h4>
                      <p className="text-sm text-blue-700">
                        Muitos erros indicam que os campos estão sendo lidos
                        como números quando deveriam ser texto. No Excel,
                        certifique-se de que as colunas estejam formatadas como{" "}
                        <strong>&quot;Texto&quot;</strong> antes de preencher os
                        dados.
                      </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {Object.entries(
                        importErrors.reduce(
                          (acc, error) => {
                            if (!acc[error.row]) {
                              acc[error.row] = [];
                            }
                            acc[error.row].push(error);
                            return acc;
                          },
                          {} as Record<number, ImportError[]>
                        )
                      ).map(([row, errors]) => (
                        <div
                          key={row}
                          className="border border-gray-200 rounded-lg p-4 bg-white"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-red-600">
                                {row}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900">
                              Linha {row} ({errors.length}{" "}
                              {errors.length === 1 ? "erro" : "erros"})
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {Object.entries(
                              errors.reduce(
                                (acc, error) => {
                                  const field =
                                    error.field || "Campo desconhecido";
                                  if (!acc[field]) {
                                    acc[field] = [];
                                  }
                                  acc[field].push(error.message);
                                  return acc;
                                },
                                {} as Record<string, string[]>
                              )
                            ).map(([field, messages]) => (
                              <div key={field} className="ml-8">
                                <div className="flex items-start gap-2">
                                  <div className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-700 capitalize">
                                      {field}:
                                    </span>
                                    <div className="mt-1 space-y-1">
                                      {messages.map((message, idx) => (
                                        <div
                                          key={idx}
                                          className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded"
                                        >
                                          {message}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        🔧 Ações Recomendadas:
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                        <li>
                          • Baixe novamente o template e verifique o formato das
                          colunas
                        </li>
                        <li>
                          • Certifique-se de que números como CPF, PIS, CEP
                          estão formatados como texto
                        </li>
                        <li>
                          • Verifique se todos os campos obrigatórios estão
                          preenchidos
                        </li>
                        <li>
                          • Confirme se os valores estão dentro dos limites
                          permitidos
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
