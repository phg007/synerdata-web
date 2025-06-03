"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { recoveryPassword } from "./services/recovery-password";

const recoverySchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

export default function RecoverPasswordPage() {
  const form = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: RecoveryFormData) => {
    try {
      const { email } = data;

      const response = await recoveryPassword({
        email,
      });

      if (!response.succeeded) {
        throw new Error(response.message || "Não foi possível recuperar sua senha.");
      }

      toast.success("Recuperação de senha", {
        description: response.message,
      });

      form.reset();
    } catch (error) {
      toast.error("Erro ao processar a recuperação de senha.", {
        description:
          `${error}` ||
          "Ocorreu um erro ao processar a recuperação de senha. Por favor, tente novamente.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Recuperação de Senha
          </CardTitle>
          <CardDescription className="text-center">
            Digite seu e-mail para receber instruções de recuperação de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Recuperar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
