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
import { Loader2, Building, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateDepartment } from "../../services/update-department";
import Link from "next/link";
import { getDepartmentById } from "../../services/get-department-by-id";
import { use, useEffect } from "react";
import { DepartmentObjectResponse } from "../../interfaces/department-interface";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

type UpdateDepartmentFormData = z.infer<typeof formSchema>;

export default function UpdateDepartmentPage({
  params,
}: {
  params: Promise<{ departmentId: string }>;
}) {
  const { departmentId } = use(params);

  const router = useRouter();

  const { data: department } = useQuery<DepartmentObjectResponse>({
    queryKey: ["department", departmentId],
    queryFn: () => getDepartmentById(departmentId!),
    enabled: !!departmentId,
  });

  const form = useForm<UpdateDepartmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        nome: department.nome,
      });
    }
  }, [department, form]);

  const { mutateAsync: updateDepartmentFn, isPending } = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      toast.success("Setor atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a setor", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: UpdateDepartmentFormData) => {
    await updateDepartmentFn({
      ...data,
      departmentId,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/empresas/setores"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para setores
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Setor</h1>
              <p className="text-gray-600">
                Atualize os dados de uma setor da sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Setor</CardTitle>
            <CardDescription>
              Preencha os campos que deseja atualizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Informações Básicas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Setor</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Setor Centro" {...field} />
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
                      "Atualizar Setor"
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
