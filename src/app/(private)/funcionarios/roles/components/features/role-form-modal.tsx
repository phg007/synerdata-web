"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema para validação dos dados do cargo
const roleSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  descricao: z
    .string()
    .min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
  departamento: z
    .string()
    .min(3, { message: "Departamento deve ter pelo menos 3 caracteres" }),
  salarioBase: z
    .number()
    .min(1, { message: "Salário base deve ser maior que zero" }),
  requisitos: z
    .string()
    .min(5, { message: "Requisitos devem ter pelo menos 5 caracteres" }),
  status: z.enum(["A", "I"], {
    required_error: "Status é obrigatório",
  }),
  atualizadoEm: z.string().optional(),
});

export type Role = z.infer<typeof roleSchema>;

type RoleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (role: Role) => void;
  initialData?: Role | null;
};

export function RoleFormModal({
  isOpen,
  onClose,
  onAddRole,
  initialData,
}: RoleFormModalProps) {
  const formId = useId();

  const form = useForm<Role>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      nome: "",
      descricao: "",
      departamento: "",
      salarioBase: 0,
      requisitos: "",
      status: "A",
      atualizadoEm: new Date().toLocaleString("pt-BR"),
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

  const onSubmit = (data: Role) => {
    const now = new Date().toLocaleString("pt-BR");
    onAddRole({
      ...data,
      id: initialData?.id || crypto.randomUUID(),
      atualizadoEm: now,
    });
    toast.success(
      initialData
        ? "Cargo atualizado com sucesso"
        : "Cargo adicionado com sucesso"
    );
    onClose();
    form.reset();
  };

  const dialogTitle = initialData ? "Editar Cargo" : "Adicionar Novo Cargo";
  const dialogDescription = initialData
    ? "Atualize os campos abaixo para editar o cargo."
    : "Preencha os campos abaixo para cadastrar um novo cargo.";

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
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cargo</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
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
            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salarioBase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salário Base</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requisitos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requisitos</FormLabel>
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">Ativo</SelectItem>
                      <SelectItem value="I">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
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
