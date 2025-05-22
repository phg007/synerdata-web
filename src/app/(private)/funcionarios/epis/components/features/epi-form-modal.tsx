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

// Schema para validação dos dados do EPI
const epiSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  descricao: z
    .string()
    .min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
  equipamentos: z
    .string()
    .min(3, { message: "Equipamentos deve ter pelo menos 3 caracteres" }),
  status: z.enum(["A", "I"], {
    required_error: "Status é obrigatório",
  }),
  atualizadoEm: z.string().optional(),
});

export type Epi = z.infer<typeof epiSchema>;

type EpiFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddEpi: (epi: Epi) => void;
  initialData?: Epi | null;
};

export function EpiFormModal({
  isOpen,
  onClose,
  onAddEpi,
  initialData,
}: EpiFormModalProps) {
  const formId = useId();

  const form = useForm<Epi>({
    resolver: zodResolver(epiSchema),
    defaultValues: initialData || {
      nome: "",
      descricao: "",
      equipamentos: "",
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

  const onSubmit = (data: Epi) => {
    const now = new Date().toLocaleString("pt-BR");
    onAddEpi({
      ...data,
      id: initialData?.id || crypto.randomUUID(),
      atualizadoEm: now,
    });
    toast.success(
      initialData ? "EPI atualizado com sucesso" : "EPI adicionado com sucesso"
    );
    onClose();
    form.reset();
  };

  const dialogTitle = initialData ? "Editar EPI" : "Adicionar Novo EPI";
  const dialogDescription = initialData
    ? "Atualize os campos abaixo para editar o EPI."
    : "Preencha os campos abaixo para cadastrar um novo EPI.";

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
                  <FormLabel>Nome do EPI</FormLabel>
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
              name="equipamentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamentos</FormLabel>
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
