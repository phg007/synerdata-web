"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getaccidentById } from "../../services/get-accident-by-id";
import { updateAccident } from "../../services/update-accident";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AcidentesObjectResponse } from "../../interfaces/accident-interfaces";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

const editaccidentSchema = z.object({
  descricao: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(255, "A descrição deve ter no máximo 255 caracteres"),
  data: z.string().min(1, "A data é obrigatória"),
  natureza: z
    .string()
    .min(1, "A natureza é obrigatória")
    .max(255, "A natureza deve ter no máximo 255 caracteres"),
  cat: z.string().max(25, "O cat deve ter no máximo 25 caracteres").optional(),
  medidasTomadas: z
    .string()
    .min(1, "As medidas tomadas são obrigatórias")
    .max(255, "As medidas tomadas devem ter no máximo 255 caracteres"),
});

type EditAccidentFormValues = z.infer<typeof editaccidentSchema>;

export default function UpdateaccidentPage({
  params,
}: {
  params: Promise<{ accidentId: string }>;
}) {
  const { accidentId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: accident } = useQuery<AcidentesObjectResponse>({
    queryKey: ["accident", accidentId],
    queryFn: () => getaccidentById(accidentId),
    enabled: !!accidentId,
  });

  const form = useForm<EditAccidentFormValues>({
    resolver: zodResolver(editaccidentSchema),
    defaultValues: {
      descricao: "",
      data: "",
      natureza: "",
      cat: "",
      medidasTomadas: "",
    },
  });

  useEffect(() => {
    if (accident) {
      const [day, month, year] = accident.data.split("/");
      form.reset({
        descricao: accident.descricao,
        data: `${year}-${month}-${day}`,
        natureza: accident.natureza,
        cat: accident.cat ?? "",
        medidasTomadas: accident.medidasTomadas,
      });
    }
  }, [accident, form]);

  const { mutateAsync: updateAccidentFn, isPending } = useMutation({
    mutationFn: updateAccident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accidents"] });
      toast.success("Acidente atualizado com sucesso");
      router.back();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar o acidente", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: EditAccidentFormValues) => {
    await updateAccidentFn({
      ...data,

      accidentId,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/ocorrencias/acidentes"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para acidentes
          </Link>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Acidente
              </h1>
              <p className="text-gray-600">
                Atualize os dados do acidente registrado
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar Acidente</CardTitle>
            <CardDescription>
              Atualize as informações do Acidente registrado
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Acidente</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            placeholder="Selecione a data"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do CAT</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={25}
                            placeholder="Ex: 123456789"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="natureza"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Natureza do Acidente</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Queda, Corte, Queimadura, etc."
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
                      <FormLabel>Descrição do Acidente</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Descreva detalhadamente como o acidente ocorreu..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medidasTomadas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medidas Tomadas</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Descreva as medidas tomadas após o acidente..."
                        />
                      </FormControl>
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
                      "Atualizar Acidente"
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
