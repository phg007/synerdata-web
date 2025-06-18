"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useId } from "react";

// Atualizar o schema para incluir os novos campos
const companySchema = z.object({
  id: z.string().optional(),
  nomeFantasia: z
    .string()
    .min(3, { message: "Nome fantasia deve ter pelo menos 3 caracteres" }),
  razaoSocial: z
    .string()
    .min(3, { message: "Razão social deve ter pelo menos 3 caracteres" }),
  cnpj: z.string(),
  // .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
  //   message: "CNPJ inválido. Use o formato 00.000.000/0000-00",
  // }),
  cep: z
    .string()
    .min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  rua: z.string().min(3, { message: "Rua deve ter pelo menos 3 caracteres" }),
  numero: z.string().min(1, { message: "Número é obrigatório" }),
  complemento: z.string().optional(),
  bairro: z
    .string()
    .min(2, { message: "Bairro deve ter pelo menos 2 caracteres" }),
  cidade: z
    .string()
    .min(2, { message: "Cidade deve ter pelo menos 2 caracteres" }),
  estado: z
    .string()
    .length(2, { message: "Estado deve ter 2 caracteres (sigla)" }),
  dataFundacao: z.string().optional(),
  faturamento: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  telefone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 caracteres" }),
  ramoAtuacao: z.string().optional(),
  regimeTributario: z.enum(["simples", "lucro_presumido", "lucro_real"], {
    required_error: "Selecione um regime tributário",
  }),
  cnaeprincipal: z.string().min(1, { message: "CNAEPRINCIPAL é obrigatório" }),
  segmento: z.string().min(1, { message: "Segmento é obrigatório" }),
  logo: z.any().optional(),
});

export type Company = z.infer<typeof companySchema>;

type CompanyFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddCompany: (company: Company) => void;
  initialData?: Company | null;
};

export function CompanyFormModal({
  isOpen,
  onClose,
  onAddCompany,
  initialData,
}: CompanyFormModalProps) {
  const formId = useId();

  // Atualizar os valores padrão no useForm
  const form = useForm<Company>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      nomeFantasia: "",
      razaoSocial: "",
      cnpj: "",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      dataFundacao: "",
      faturamento: "",
      inscricaoEstadual: "",
      telefone: "",
      ramoAtuacao: "",
      regimeTributario: "simples",
      cnaeprincipal: "",
      segmento: "",
      logo: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }

    return () => {
      // Cleanup function
    };
  }, [initialData, form]);

  const onSubmit = (data: Company) => {
    onAddCompany({
      ...data,
      id: initialData?.id || crypto.randomUUID(),
    });
    toast.success(
      initialData
        ? "Empresa atualizada com sucesso"
        : "Empresa adicionada com sucesso"
    );
    onClose();
    form.reset();
  };

  const dialogTitle = initialData ? "Editar Empresa" : "Adicionar Nova Empresa";
  const dialogDescription = initialData
    ? "Atualize os campos abaixo para editar a empresa."
    : "Preencha os campos abaixo para cadastrar uma nova empresa.";

  const submitButtonText = initialData ? "Atualizar" : "Salvar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nomeFantasia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome fantasia</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão social</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="00.000.000/0000-00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cep</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Novos campos de endereço detalhado */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado (UF)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        maxLength={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataFundacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fundação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="faturamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faturamento Anual (R$)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="inscricaoEstadual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscrição Estadual</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ramoAtuacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ramo de Atuação</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="regimeTributario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regime tributário</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o regime" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simples">
                          Simples Nacional
                        </SelectItem>
                        <SelectItem value="lucro_presumido">
                          Lucro Presumido
                        </SelectItem>
                        <SelectItem value="lucro_real">Lucro Real</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnaeprincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNAE</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="segmento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segmento</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">{submitButtonText}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
