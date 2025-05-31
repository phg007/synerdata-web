"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getEPIById, updateEPI } from "@/app/(private)/empresas/epis/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const editEpiSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  descricao: z.string().min(5, {
    message: "A descrição deve ter pelo menos 5 caracteres.",
  }),
  equipamentos: z.string().min(5, {
    message: "Os equipamentos devem ter pelo menos 5 caracteres.",
  }),
});

type EditEpiFormValues = z.infer<typeof editEpiSchema>;

export default function EditEPIPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  const { data: epi, isLoading } = useQuery({
    queryKey: ["epi", id],
    queryFn: () => getEPIById(id!, token!),
    enabled: !!id && !!token,
  });

  const form = useForm<EditEpiFormValues>({
    resolver: zodResolver(editEpiSchema),
    values: {
      nome: epi?.nome || "",
      descricao: epi?.descricao || "",
      equipamentos: epi?.equipamentos || "",
    },
  });

  const updateEPIMutation = useMutation({
    mutationFn: (data: EditEpiFormValues) =>
      updateEPI({ ...epi!, ...data }, token!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["epi", id] });
      toast.success(data.message);
      router.back();
    },
    onError: (error) => {
      console.error("Erro ao atualizar EPI:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: EditEpiFormValues) => {
    updateEPIMutation.mutate(data);
  };

  const handleClose = () => {
    router.back();
  };

  if (isLoading || !epi) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
        <div className="bg-background p-6 rounded-lg shadow-lg w-[500px]">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar EPI</DialogTitle>
          <DialogDescription>
            Atualize as informações do EPI {epi.nome}.
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
                    <Input
                      placeholder="Ex: Kit de Proteção Básico"
                      {...field}
                      disabled={updateEPIMutation.isPending}
                    />
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
                      {...field}
                      disabled={updateEPIMutation.isPending}
                      rows={3}
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
                      {...field}
                      disabled={updateEPIMutation.isPending}
                      rows={4}
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
                onClick={handleClose}
                disabled={updateEPIMutation.isPending}
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
      </DialogContent>
    </Dialog>
  );
}
