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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../services/update-user";

const criarUsuarioSchema = z.object({
  funcao: z.string().min(1, "Selecione a função"),
});

type UpdateUserFormData = z.infer<typeof criarUsuarioSchema>;

interface UpdateUserDialogProps {
  userId: string;
  companyId: string;
  setOpen: (open: boolean) => void;
}

export default function UpdateUserDialog({
  userId,
  companyId,
  setOpen,
}: UpdateUserDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(criarUsuarioSchema),
    defaultValues: {
      funcao: "",
    },
  });

  const { mutateAsync: updateUserFn, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", companyId] });

      setOpen(false);
      form.reset();
      toast.success("Usuário atualizado com sucesso.");
    },
    onError: (error: Error) => {
      setOpen(false);
      form.reset();
      toast.error("Erro ao atualizar o usuário.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUserFn({
        userId,
        funcao: data.funcao,
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center">
          Atualizar Usuário
        </DialogTitle>
        <DialogDescription>
          Atualize as informações do usuário abaixo.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="funcao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função na organização</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GESTOR_1">
                        Gestor de Funcionários e Ocorrências
                      </SelectItem>
                      <SelectItem value="GESTOR_2">
                        Gestor de Ocorrências
                      </SelectItem>
                      <SelectItem value="VISUALIZADOR">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>Atualizar</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
