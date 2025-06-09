"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEPIById, updateEPI } from "@/app/(private)/empresas/epis/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const editEpiSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  descricao: z
    .string()
    .min(5, { message: "A descrição deve ter pelo menos 5 caracteres." }),
  equipamentos: z
    .string()
    .min(5, { message: "Os equipamentos devem ter pelo menos 5 caracteres." }),
});

type EditEpiFormValues = z.infer<typeof editEpiSchema>;

interface UpdateEpiDialogProps {
  epiId: string;
  setOpen: (open: boolean) => void;
}

export default function UpdateEpiDialog({
  epiId,
  setOpen,
}: UpdateEpiDialogProps) {
  const queryClient = useQueryClient();

  const { data: epi } = useQuery({
    queryKey: ["epi", epiId],
    queryFn: () => getEPIById(epiId),
    enabled: !!epiId,
  });

  const form = useForm<EditEpiFormValues>({
    resolver: zodResolver(editEpiSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      equipamentos: "",
    },
  });

  useEffect(() => {
    if (epi) {
      form.reset({
        nome: epi.nome,
        descricao: epi.descricao,
        equipamentos: epi.equipamentos,
      });
    }
  }, [epi, form]);

  const updateEPIMutation = useMutation({
    mutationFn: (data: EditEpiFormValues) => updateEPI({ ...epi!, ...data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["epis"] });
      toast.success(data.message);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setOpen(false);
    },
  });

  const onSubmit = (data: EditEpiFormValues) => {
    updateEPIMutation.mutate(data);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar EPI</DialogTitle>
        <DialogDescription>
          Atualize as informações do EPI {epi?.nome}.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do EPI</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Kit de Proteção Básico" {...field} />
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
                    placeholder="Descrição detalhada do kit de EPI e sua finalidade"
                    rows={3}
                    {...field}
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
                <FormLabel>Equipamentos Inclusos</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Capacete, Luvas, Óculos de Proteção..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateEPIMutation.isPending}>
              {updateEPIMutation.isPending
                ? "Salvando..."
                : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
