"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, IdCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateCbo } from "../../services/update-cbo";
import Link from "next/link";
import { getCboById } from "../../services/get-cbo-by-id";
import { use, useEffect } from "react";
import { CboObjectResponse } from "../../interfaces/cbo-interface";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

type UpdateCboFormData = z.infer<typeof formSchema>;

export default function UpdateCboPage({
  params,
}: {
  params: Promise<{ cboId: string }>;
}) {
  const { cboId } = use(params);

  const router = useRouter();

  const { data: cbo } = useQuery<CboObjectResponse>({
    queryKey: ["cbo", cboId],
    queryFn: () => getCboById(cboId!),
    enabled: !!cboId,
  });

  const form = useForm<UpdateCboFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (cbo) {
      form.reset({
        nome: cbo.nome,
      });
    }
  }, [cbo, form]);

  const { mutateAsync: updateCboFn, isPending } = useMutation({
    mutationFn: updateCbo,
    onSuccess: () => {
      toast.success("Cbo atualizado com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar o cbo", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: UpdateCboFormData) => {
    await updateCboFn({
      ...data,
      cboId,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/empresas/cbos"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para cbos
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IdCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Cbo</h1>
              <p className="text-gray-600">
                Atualize os dados de um cbo da sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Cbo</CardTitle>
            <CardDescription>
              Preencha o campo que deseja atualizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Cbo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Auxiliar de escritório"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      "Atualizar Cbo"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
