"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Building } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "../services/create-branch";
import { isValidCNPJ } from "@/app/(public)/pagamento/utils/checkout-utils";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z
    .string()
    .min(14, "CNPJ inválido")
    .max(18)
    .refine((val) => isValidCNPJ(val), {
      message: "CNPJ inválido",
    }),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().min(8, "CEP inválido"),
  dataFundacao: z.string().min(1, "Data de fundação é obrigatória"),
  telefone: z.string().optional(),
  celular: z.string(),
});

type CreateBranchFormData = z.infer<typeof formSchema>;

interface CreateBranchDialogProps {
  companyId: string;
  setOpen: (open: boolean) => void;
}

export default function CreateBranchDialog({
  companyId,
  setOpen,
}: CreateBranchDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateBranchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      dataFundacao: "",
      telefone: "",
      celular: "",
    },
  });

  const { mutateAsync: createBranchFn, isPending } = useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", companyId] });

      setOpen(false);
      form.reset();
      toast.success("Filial cadastrada com sucesso!");
    },
    onError: (error: Error) => {
      setOpen(false);
      form.reset();
      toast.error("Erro ao cadastrar a filial.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: CreateBranchFormData) => {
    await createBranchFn({ ...data, empresaId: companyId });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5 text-indigo-600" />
          Cadastrar Filial
        </DialogTitle>
        <DialogDescription>
          Preencha os dados para adicionar uma nova filial à empresa.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          {[
            { name: "nome", label: "Nome da Filial" },
            { name: "cnpj", label: "CNPJ" },
            { name: "rua", label: "Rua" },
            { name: "numero", label: "Número" },
            { name: "complemento", label: "Complemento", optional: true },
            { name: "bairro", label: "Bairro" },
            { name: "cidade", label: "Cidade" },
            { name: "estado", label: "Estado" },
            { name: "cep", label: "CEP" },
            { name: "dataFundacao", label: "Data de Fundação", type: "date" },
            { name: "telefone", label: "Telefone", optional: true },
            { name: "celular", label: "Celular", optional: true },
          ].map(({ name, label, type = "text" }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof CreateBranchFormData}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input type={type} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>Cadastrar Filial</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
