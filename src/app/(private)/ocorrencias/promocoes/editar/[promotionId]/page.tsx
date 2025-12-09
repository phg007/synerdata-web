"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPromotionById } from "../../services/get-promotion-by-id";
import {
  getRolesByCompany,
  RoleObjectResponse,
} from "../../services/get-roles-by-company";
import { updatePromotion } from "../../services/update-promotion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PromotionObjectResponse } from "../../interfaces/promotion-interfaces";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const editPromotionSchema = z.object({
  data: z.string().min(1, "A data da promoção é obrigatória"),
  salario: z.coerce.number({
    required_error: "O salário é obrigatório",
    invalid_type_error: "Informe um salário válido",
  }),
  funcaoId: z.string().min(1, "Selecione a nova função"),
});

type EditPromotionFormValues = z.infer<typeof editPromotionSchema>;

export default function UpdatePromotionPage({
  params,
}: {
  params: Promise<{ promotionId: string }>;
}) {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const { promotionId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: promotion } = useQuery<PromotionObjectResponse>({
    queryKey: ["promotion", promotionId],
    queryFn: () => getPromotionById(promotionId),
    enabled: !!promotionId,
  });

  const { data: roles = [] } = useQuery<RoleObjectResponse[]>({
    queryKey: ["roles", companyId],
    queryFn: () => getRolesByCompany(companyId!),
    enabled: !!companyId,
  });

  const form = useForm<EditPromotionFormValues>({
    resolver: zodResolver(editPromotionSchema),
    defaultValues: {
      data: "",
      salario: 0,
      funcaoId: "",
    },
  });

  useEffect(() => {
    if (promotion) {
      const [day, month, year] = promotion.data.split("/");
      form.reset({
        data: `${year}-${month}-${day}`,
        salario: promotion.salario,
        funcaoId: promotion.funcao?.id || "",
      });
    }
  }, [promotion, form]);

  const { mutateAsync: updatePromotionFn, isPending } = useMutation({
    mutationFn: updatePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promoção atualizada com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar a promoção", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditPromotionFormValues) => {
    await updatePromotionFn({
      ...data,
      promotionId,
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/ocorrencias/promocoes">
                  Promoções
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/ocorrencias/promocoes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4 pt-0">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Promoção</CardTitle>
              <CardDescription>
                Atualize as informações da promoção registrada
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Promoção</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Novo Salário</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="funcaoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Função</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a nova função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        "Atualizar Promoção"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
