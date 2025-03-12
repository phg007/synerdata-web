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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useId } from "react";

const companySchema = z.object({
  id: z.string().optional(),
  fantasyName: z
    .string()
    .min(3, { message: "Nome fantasia deve ter pelo menos 3 caracteres" }),
  legalName: z
    .string()
    .min(3, { message: "Razão social deve ter pelo menos 3 caracteres" }),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: "CNPJ inválido. Use o formato 00.000.000/0000-00",
  }),
  address: z
    .string()
    .min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  phone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 caracteres" }),
  additionalData: z.string().optional(),
  taxRegime: z.enum(["simples", "lucro_presumido", "lucro_real"], {
    required_error: "Selecione um regime tributário",
  }),
  cnae: z.string().min(1, { message: "CNAE é obrigatório" }),
  segment: z.string().min(1, { message: "Segmento é obrigatório" }),
  logo: z.any().optional(),
  sectors: z.string().optional(),
  branches: z.string().optional(),
  costCenters: z.string().optional(),
  ppEs: z.string().optional(),
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

  const form = useForm<Company>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      fantasyName: "",
      legalName: "",
      cnpj: "",
      address: "",
      phone: "",
      additionalData: "",
      taxRegime: "simples",
      cnae: "",
      segment: "",
      logo: null,
      sectors: "",
      branches: "",
      costCenters: "",
      ppEs: "",
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
                name="fantasyName"
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
                name="legalName"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
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
              name="additionalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dados complementares</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taxRegime"
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
                name="cnae"
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
              name="segment"
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

            <FormField
              control={form.control}
              name="sectors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setores</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filiais</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costCenters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centros de custo</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ppEs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EPIs</FormLabel>
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
