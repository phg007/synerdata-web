"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useId } from "react";

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.enum(["admin", "manager", "viewer"], {
    required_error: "Selecione uma função",
  }),
  status: z.enum(["ativo", "inativo"], {
    required_error: "Selecione um status",
  }),
});

export type User = z.infer<typeof userSchema>;

type UserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: User) => void;
  initialData?: User | null;
};

export function UserFormModal({
  isOpen,
  onClose,
  onAddUser,
  initialData,
}: UserFormModalProps) {
  const formId = useId();

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      id: "",
      name: "",
      email: "",
      role: "viewer",
      status: "ativo",
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

  const onSubmit = (data: User) => {
    onAddUser({
      ...data,
      id: initialData?.id || crypto.randomUUID(),
    });
    toast.success(
      initialData
        ? "Usuário atualizado com sucesso"
        : "Usuário criado com sucesso"
    );
    onClose();
    form.reset();
  };

  const dialogTitle = initialData ? "Editar Usuário" : "Adicionar Novo Usuário";
  const dialogDescription = initialData
    ? "Atualize os campos abaixo para editar o usuário."
    : "Preencha os campos abaixo para criar um novo usuário.";

  const submitButtonText = initialData ? "Atualizar" : "Salvar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do usuário</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">
                        Administrador da empresa
                      </SelectItem>
                      <SelectItem value="manager">
                        Gestor de funcionários
                      </SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
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
