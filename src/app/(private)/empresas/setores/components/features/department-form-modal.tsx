"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema de validação Zod - apenas nome
const departmentSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" })
    .trim()
    .refine((val) => val.length > 0, { message: "Nome é obrigatório" }),
});

// Definindo os tipos
export type DepartmentFormData = z.infer<typeof departmentSchema>;

export interface Department extends DepartmentFormData {
  id: string;
  created_at?: string;
  updated_at?: string;
}

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (department: DepartmentFormData) => void;
  onUpdateDepartment: (department: { id: string; nome: string }) => void;
  department: Department | null;
}

export function DepartmentFormModal({
  isOpen,
  onClose,
  onAddDepartment,
  onUpdateDepartment,
  department,
}: DepartmentFormModalProps) {
  const isEditing = !!department;

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      nome: "",
    },
  });

  // Reset form when modal opens/closes or department changes
  useEffect(() => {
    if (isOpen) {
      if (department) {
        // For editing, set the current department name
        form.reset({
          nome: department.nome,
        });
      } else {
        // For creating, reset to empty
        form.reset({
          nome: "",
        });
      }
    } else {
      // Reset when modal closes
      form.reset({
        nome: "",
      });
    }
  }, [isOpen, department, form]);

  // Handle form submission
  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (isEditing && department) {
        await onUpdateDepartment({
          id: department.id,
          nome: data.nome.trim(),
        });
      } else {
        await onAddDepartment({
          nome: data.nome.trim(),
        });
      }
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Departamento" : "Adicionar Departamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite o nome do departamento selecionado."
              : "Digite o nome para adicionar um novo departamento."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Departamento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome do departamento"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? isEditing
                    ? "Atualizando..."
                    : "Adicionando..."
                  : isEditing
                    ? "Atualizar"
                    : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
