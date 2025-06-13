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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Loader2, Building, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateRole } from "../../services/update-role";
import Link from "next/link";
import { getRoleById } from "../../services/get-role-by-id";
import { use, useEffect } from "react";
import { RoleObjectResponse } from "../../interfaces/role-interface";
// import { useSession } from "next-auth/react";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

type UpdateRoleFormData = z.infer<typeof formSchema>;

export default function UpdateRolePage({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const { roleId } = use(params);

  // const { data: session } = useSession();
  const router = useRouter();

  // const companyId = session?.user.empresa;

  const { data: role } = useQuery<RoleObjectResponse>({
    queryKey: ["role", roleId],
    queryFn: () => getRoleById(roleId!),
    enabled: !!roleId,
  });

  // const { data: epis = [] } = useQuery<EpiObjectResponse[]>({
  //   queryKey: ["epis", companyId],
  //   queryFn: () => getRolesByCompany(companyId!),
  //   enabled: !!companyId,
  // });

  const form = useForm<UpdateRoleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        nome: role.nome,
      });
    }
  }, [role, form]);

  const { mutateAsync: updateRoleFn, isPending } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      toast.success("Função atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a função", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: UpdateRoleFormData) => {
    await updateRoleFn({
      ...data,
      roleId,
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
            Voltar para funções
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Função
              </h1>
              <p className="text-gray-600">
                Atualize os dados de uma função da sua empresa
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Função</CardTitle>
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
                          <FormLabel>Nome da Função</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Recepcionista" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="epis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Epis</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o(s) epi(s)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {epis.map(({ id, nome }) => (
                                <SelectItem key={id} value={id}>
                                  {nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
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
                      "Atualizar Função"
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
