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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteUser } from "../services/invite-user";

const criarUsuarioSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  funcao: z.string().min(1, "Selecione a função"),
});

type InviteUserFormData = z.infer<typeof criarUsuarioSchema>;

interface InviteUserDialogProps {
  companyId: string;
  setOpen: (open: boolean) => void;
}

export default function InviteUserDialog({
  companyId,
  setOpen,
}: InviteUserDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(criarUsuarioSchema),
    defaultValues: {
      email: "",
      funcao: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: inviteUserFn, isPending } = useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", companyId] });

      setOpen(false);
      form.reset();
      toast.success("Um convite foi enviado para o email do usuário!");
    },
    onError: (error: Error) => {
      setOpen(false);
      form.reset();
      toast.error("Erro ao criar usuário", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: InviteUserFormData) => {
    try {
      await inviteUserFn({
        email: data.email,
        funcao: data.funcao,
        empresaId: companyId,
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <UserPlus className="mr-2 h-5 w-5 text-indigo-600" />
          Convidar Usuário
        </DialogTitle>
        <DialogDescription>
          Envie um convite por e-mail para que o usuário se junte à sua
          organização.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="colaborador@empresa.com"
                      type="email"
                      {...field}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="pt-4 text-sm text-slate-500">
            Um e-mail será enviado com um link para que o usuário possa criar
            sua conta e se juntar à organização.
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>Enviar Convite</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
