"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2, DollarSign, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createCostCenter } from "../services/create-cost-center";
import Link from "next/link";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

type CreateCostCenterFormData = z.infer<typeof formSchema>;

export default function CreateCostCenterPage() {
  const { data: session } = useSession();

  const companyId = session?.user.empresa;

  const form = useForm<CreateCostCenterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
    },
  });

  const { mutateAsync: createCostCenterFn, isPending } = useMutation({
    mutationFn: createCostCenter,
    onSuccess: () => {
      toast.success("Centro de custo cadastrado com sucesso");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error("Erro ao cadastrar o centro de custo", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: CreateCostCenterFormData) => {
    await createCostCenterFn({
      ...data,
      empresaId: companyId!,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/empresas/centros-de-custo"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para centros de custo
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Novo Centro de custo
              </h1>
              <p className="text-gray-600">
                Cadastre um novo centro de custo para sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Centro de custo</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios para cadastrar o novo centro
              de custo
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
                          <FormLabel>
                            Nome do Centro de custo{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Financeiro" {...field} />
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
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Centro de custo"
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
