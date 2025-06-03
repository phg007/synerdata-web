"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { activateAccount } from "@/app/(public)/ativacao/services/activate-account";
import { useRouter } from "next/navigation";

const activationSchema = z
  .object({
    nome: z.string().min(3, "O nome deve conter pelo menos 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string(),
    activationToken: z.string().uuid(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ActivationFormData = z.infer<typeof activationSchema>;

export default function ActivationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<ActivationFormData>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      confirmPassword: "",
      activationToken: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const codeFromUrl = searchParams.get("activationToken");

    if (emailFromUrl) {
      form.setValue("email", emailFromUrl, { shouldValidate: true });
    }

    if (codeFromUrl) {
      form.setValue("activationToken", codeFromUrl, { shouldValidate: true });
    }
  }, [searchParams, form]);

  const onSubmit = async (data: ActivationFormData) => {
    try {
      const { nome, email, password, activationToken } = data;

      const response = await activateAccount({
        nome,
        email,
        password,
        activationToken,
      });

      if (!response.succeeded) {
        throw new Error(response.message || "Não foi possível ativar a conta.");
      }

      toast.success("Conta ativada com sucesso!", {
        description: "Você será redirecionado para a página de login.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Erro ao processar ativação:", error);
      toast.error("Erro ao processar ativação", {
        description:
          `${error}` ||
          "Ocorreu um erro ao processar sua ativação. Por favor, tente novamente.",
      });
    }
  };

  const checkPasswordStrength = (password: string) => {
    const criteria = [
      { regex: /.{8,}/, text: "Pelo menos 8 caracteres" },
      { regex: /[A-Z]/, text: "Pelo menos uma letra maiúscula" },
      { regex: /[a-z]/, text: "Pelo menos uma letra minúscula" },
      { regex: /[0-9]/, text: "Pelo menos um número" },
      { regex: /[^A-Za-z0-9]/, text: "Pelo menos um caractere especial" },
    ];

    return criteria.map((criterion) => ({
      met: criterion.regex.test(password),
      text: criterion.text,
    }));
  };

  const passwordCriteria = checkPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container max-w-lg mx-auto py-8 px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xl">
          <div className="space-y-2 mb-6 text-center">
            <h1 className="text-2xl font-bold">Ativar sua conta</h1>
            <p className="text-slate-500 text-sm">
              Preencha os dados abaixo para ativar sua conta
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Digite sua senha"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPassword(e.target.value);
                          }}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Critérios de senha */}
              <div className="space-y-2 text-sm">
                <p className="font-medium text-slate-700">
                  Sua senha deve conter:
                </p>
                <ul className="space-y-1">
                  {passwordCriteria.map((criterion, index) => (
                    <li key={index} className="flex items-center">
                      {criterion.met ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-300 mr-2" />
                      )}
                      <span
                        className={
                          criterion.met ? "text-slate-700" : "text-slate-500"
                        }
                      >
                        {criterion.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirme sua senha"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activationToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token de ativação</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o código recebido"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-slate-500">
                Ao ativar sua conta, você sinaliza estar de acordo com os{" "}
                <Link
                  href="/termos-de-uso"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Termos de Uso
                </Link>
                .
              </div>

              <Button type="submit" className="w-full">
                Ativar
              </Button>

              <div className="text-center text-sm">
                <p className="text-slate-500">
                  Já possui uma conta ativa?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Faça login
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
