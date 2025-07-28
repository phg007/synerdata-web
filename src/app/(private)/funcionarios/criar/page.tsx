"use client";

import type React from "react";
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
  FormDescription,
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
import { Loader2, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createEmployee } from "../services/create-employee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sexo,
  EstadoCivil,
  RegimeContratacao,
  GrauInstrucao,
  Escala,
} from "../enums/employee-enums";
import {
  formatCPF,
  formatRG,
  formatPIS,
  formatCTPS,
  isValidCPF,
} from "@/lib/utils";
import {
  formatCEP,
  formatMobilePhone,
  formatPhone,
} from "@/app/(public)/pagamento/utils/checkout-utils";
import { getDepartmentsByCompany } from "../../empresas/setores/services/get-departments-by-company";
import { DepartmentObjectResponse } from "../../empresas/setores/interfaces/department-interface";
import { getCbosByCompany } from "../../empresas/cbos/services/get-cbos-by-company";
import { CboObjectResponse } from "../../empresas/cbos/interfaces/cbo-interface";
import { getCostCentersByCompany } from "../../empresas/centros-de-custo/services/get-cost-centers-by-company";
import { CostCenterObjectResponse } from "../../empresas/centros-de-custo/interfaces/cost-center-interface";
import { RoleObjectResponse } from "../../empresas/funcoes/interfaces/role-interface";
import { getRolesByCompany } from "../../empresas/funcoes/services/get-roles-by-company";
import { NumericFormat } from "react-number-format";

const formSchema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    cpf: z
      .string()
      .min(11, "CPF inválido")
      .refine((val) => isValidCPF(val), {
        message: "CPF inválido",
      }),
    carteiraIdentidade: z.string().min(1, "RG é obrigatório"),
    dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    sexo: z.nativeEnum(Sexo, { required_error: "Sexo é obrigatório" }),
    estadoCivil: z.nativeEnum(EstadoCivil, {
      required_error: "Estado civil é obrigatório",
    }),
    grauInstrucao: z.nativeEnum(GrauInstrucao, {
      required_error: "Grau de instrução é obrigatório",
    }),
    naturalidade: z.string().min(1, "Naturalidade é obrigatória"),
    nacionalidade: z.string().min(1, "Nacionalidade é obrigatória"),
    altura: z
      .number({
        required_error: "Altura é obrigatória",
        invalid_type_error: "Altura deve ser um número",
      })
      .min(0.5, "Altura deve estar entre 0,5m e 3m")
      .max(3, "Altura deve estar entre 0,5m e 3m"),
    peso: z
      .number({
        required_error: "Peso é obrigatório",
        invalid_type_error: "Peso deve ser um número",
      })
      .min(20, "Peso deve estar entre 20kg e 300kg")
      .max(300, "Peso deve estar entre 20kg e 300kg"),
    filhos: z.boolean(),
    quantidadeFilhos: z.number().optional(),
    filhosAbaixoDe21: z.boolean().optional(),
    nomePai: z.string().optional(),
    nomeMae: z.string().min(1, "Nome da mãe é obrigatório"),
    necessidadesEspeciais: z.boolean(),
    tipoDeficiencia: z.string().optional(),
    pis: z.string().min(11, "PIS inválido"),
    ctpsNumero: z
      .string()
      .min(1, "Número da CTPS é obrigatório")
      .max(7, "Número da CTPS inválido"),
    ctpsSerie: z
      .string()
      .min(1, "Série da CTPS é obrigatória")
      .max(4, "Série da CTPS inválida"),
    certificadoReservista: z
      .string()
      .min(1, "Certificado de reservista é obrigatório"),
    regimeContratacao: z.nativeEnum(RegimeContratacao, {
      required_error: "Regime de contratação é obrigatório",
    }),
    dataAdmissao: z.string().min(1, "Data de admissão é obrigatória"),
    salario: z.number().min(0, "Salário deve ser maior que 0"),
    valorAlimentacao: z
      .number()
      .min(0, "Valor alimentação deve ser maior que 0"),
    valorTransporte: z.number().min(0, "Valor transporte deve ser maior que 0"),
    funcao: z.string().min(1, "Função é obrigatória"),
    setor: z.string().min(1, "Setor é obrigatório"),
    gestor: z.string().min(1, "Gestor é obrigatório"),
    cbo: z.string().min(1, "CBO é obrigatório"),
    cargaHoraria: z
      .number({
        required_error: "Carga horária é obrigatória",
        invalid_type_error: "Carga horária deve ser um número",
      })
      .min(1, "Carga horária deve ser maior que 0")
      .max(44, "Carga horária não pode exceder 44h"),
    escala: z.nativeEnum(Escala, { required_error: "Escala é obrigatória" }),
    centroCusto: z.string().optional(),
    dataExameAdmissional: z.string().optional(),
    vencimentoExperiencia1: z.string().optional(),
    vencimentoExperiencia2: z.string().optional(),
    dataUltimoASO: z.string().optional(),
    dataExameDemissional: z.string().optional(),
    celular: z.string().min(15, "Celular inválido"),
    telefone: z.string().optional(),
    rua: z.string().min(1, "Rua é obrigatória"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    estado: z.string().min(2, "Estado é obrigatório"),
    cep: z.string().min(8, "CEP inválido"),
    quantidadeOnibus: z.number().optional(),
    latitude: z
      .number()
      .min(-90, "Latitude deve estar entre -90 e +90 graus")
      .max(90, "Latitude deve estar entre -90 e +90 graus")
      .optional(),
    longitude: z
      .number()
      .min(-180, "Longitude deve estar entre -180 e +180 graus")
      .max(180, "Longitude deve estar entre -180 e +180 graus")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.regimeContratacao === RegimeContratacao.CLT &&
      !data.dataExameAdmissional
    ) {
      ctx.addIssue({
        path: ["dataExameAdmissional"],
        code: z.ZodIssueCode.custom,
        message: "Data do exame admissional é obrigatória para regime CLT",
      });
    }
  });

type CreateEmployeeFormData = z.infer<typeof formSchema>;

const estados = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

export default function CreateEmployeePage() {
  const { data: session } = useSession();
  const companyId = session?.user?.empresa;

  const { data: roles = [] } = useQuery<RoleObjectResponse[]>({
    queryKey: ["roles", companyId],
    queryFn: () => getRolesByCompany(companyId!),
    enabled: !!companyId,
  });

  const { data: departments = [] } = useQuery<DepartmentObjectResponse[]>({
    queryKey: ["departments", companyId],
    queryFn: () => getDepartmentsByCompany(companyId!),
    enabled: !!companyId,
  });

  const { data: costCenters = [] } = useQuery<CostCenterObjectResponse[]>({
    queryKey: ["cost-centers", companyId],
    queryFn: () => getCostCentersByCompany(companyId!),
    enabled: !!companyId,
  });

  const { data: cbos = [] } = useQuery<CboObjectResponse[]>({
    queryKey: ["cbos", companyId],
    queryFn: () => getCbosByCompany(companyId!),
    enabled: !!companyId,
  });

  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      carteiraIdentidade: "",
      cpf: "",
      sexo: Sexo.MASCULINO,
      dataNascimento: "",
      estadoCivil: EstadoCivil.SOLTEIRO,
      naturalidade: "",
      nacionalidade: "Brasileira",
      altura: 0,
      peso: 0,
      nomePai: "",
      nomeMae: "",
      email: "",
      pis: "",
      ctpsNumero: "",
      ctpsSerie: "",
      certificadoReservista: "",
      regimeContratacao: RegimeContratacao.CLT,
      dataAdmissao: "",
      salario: 0,
      valorAlimentacao: 0,
      valorTransporte: 0,
      dataUltimoASO: "",
      funcao: "",
      setor: "",
      dataExameAdmissional: "",
      vencimentoExperiencia1: "",
      vencimentoExperiencia2: "",
      dataExameDemissional: "",
      centroCusto: "",
      grauInstrucao: GrauInstrucao.FUNDAMENTAL,
      necessidadesEspeciais: false,
      tipoDeficiencia: "",
      filhos: false,
      quantidadeFilhos: 0,
      filhosAbaixoDe21: false,
      telefone: "",
      celular: "",
      gestor: "",
      cbo: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      latitude: undefined,
      longitude: undefined,
      quantidadeOnibus: 0,
      cargaHoraria: 40,
      escala: Escala.SEIS_UM,
    },
  });

  const { mutateAsync: createEmployeeFn, isPending } = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success("Funcionário cadastrado com sucesso!");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error("Erro ao cadastrar funcionário", {
        description: error.message,
      });
    },
  });

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    form.setValue("cpf", formattedValue, { shouldValidate: true });
  };

  const handleRGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatRG(e.target.value);
    form.setValue("carteiraIdentidade", formattedValue, {
      shouldValidate: true,
    });
  };

  const handlePISChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPIS(e.target.value);
    form.setValue("pis", formattedValue, { shouldValidate: true });
  };

  const handleCTPS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCTPS(e.target.value);
    form.setValue("ctpsNumero", formattedValue, { shouldValidate: true });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    form.setValue("altura", value, { shouldValidate: true });
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    form.setValue("peso", value, { shouldValidate: true });
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCEP(e.target.value);
    form.setValue("cep", formattedValue, { shouldValidate: true });
  };

  const handleMobilePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatMobilePhone(e.target.value);
    form.setValue("celular", formattedValue, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    form.setValue("telefone", formattedValue, { shouldValidate: true });
  };

  const validateLatitude = (value: string): boolean => {
    if (!value) return true;
    const num = Number.parseFloat(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  };

  const validateLongitude = (value: string): boolean => {
    if (!value) return true;
    const num = Number.parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  const onSubmit = async (data: CreateEmployeeFormData) => {
    const employee = {
      ...data,
      cpf: data.cpf.replace(/\D/g, ""),
      pis: data.pis.replace(/\D/g, ""),
      carteiraIdentidade: data.carteiraIdentidade.replace(/\D/g, ""),
      dataUltimoASO: data.dataUltimoASO?.trim() || undefined,
      dataExameAdmissional: data.dataExameAdmissional?.trim() || undefined,
      vencimentoExperiencia1: data.vencimentoExperiencia1?.trim() || undefined,
      vencimentoExperiencia2: data.vencimentoExperiencia2?.trim() || undefined,
      dataExameDemissional: data.dataExameDemissional?.trim() || undefined,
      tipoDeficiencia: data.tipoDeficiencia?.trim() || undefined,
      telefone: data.telefone?.trim() || undefined,
      complemento: data.complemento?.trim() || undefined,
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
    };

    await createEmployeeFn({ empresaId: companyId, data: employee });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/funcionarios"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para funcionários
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Novo Funcionário
              </h1>
              <p className="text-gray-600">
                Cadastre um novo funcionário para sua empresa
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Dados pessoais e de identificação do funcionário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome Completo <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo do funcionário"
                            {...field}
                          />
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
                        <FormLabel>
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="funcionario@empresa.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CPF <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleCPFChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="carteiraIdentidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          RG <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00.000.000-0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleRGChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataNascimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data de Nascimento{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="sexo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Sexo <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o sexo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Sexo.MASCULINO}>
                              Masculino
                            </SelectItem>
                            <SelectItem value={Sexo.FEMININO}>
                              Feminino
                            </SelectItem>
                            <SelectItem value={Sexo.OUTRO}>Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estadoCivil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Estado Civil <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado civil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={EstadoCivil.SOLTEIRO}>
                              Solteiro(a)
                            </SelectItem>
                            <SelectItem value={EstadoCivil.CASADO}>
                              Casado(a)
                            </SelectItem>
                            <SelectItem value={EstadoCivil.DIVORCIADO}>
                              Divorciado(a)
                            </SelectItem>
                            <SelectItem value={EstadoCivil.VIUVO}>
                              Viúvo(a)
                            </SelectItem>
                            <SelectItem value={EstadoCivil.UNIAO_ESTAVEL}>
                              União Estável
                            </SelectItem>
                            <SelectItem value={EstadoCivil.SEPARADO}>
                              Separado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grauInstrucao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Grau de Instrução{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a escolaridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={GrauInstrucao.FUNDAMENTAL}>
                              Fundamental
                            </SelectItem>
                            <SelectItem value={GrauInstrucao.MEDIO}>
                              Médio
                            </SelectItem>
                            <SelectItem value={GrauInstrucao.SUPERIOR}>
                              Superior
                            </SelectItem>
                            <SelectItem value={GrauInstrucao.POS_GRADUACAO}>
                              Pós-graduação
                            </SelectItem>
                            <SelectItem value={GrauInstrucao.MESTRADO}>
                              Mestrado
                            </SelectItem>
                            <SelectItem value={GrauInstrucao.DOUTORADO}>
                              Doutorado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="naturalidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Naturalidade <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cidade de nascimento"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nacionalidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nacionalidade <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nacionalidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <FormField
                    control={form.control}
                    name="altura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Altura (m) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="1.75"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleHeightChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="peso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Peso (kg) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="70.5"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleWeightChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filhos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Possui filhos?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("filhos") && (
                    <>
                      <FormField
                        control={form.control}
                        name="quantidadeFilhos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade de Filhos</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="filhosAbaixoDe21"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Filhos abaixo de 21 anos?</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomePai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pai</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo do pai"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nomeMae"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome da Mãe <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo da mãe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="necessidadesEspeciais"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Possui necessidades especiais?</FormLabel>
                          <FormDescription>
                            Marque se o funcionário possui alguma deficiência ou
                            necessidade especial
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("necessidadesEspeciais") && (
                    <FormField
                      control={form.control}
                      name="tipoDeficiencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Deficiência</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o tipo de deficiência ou necessidade especial"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>
                  Documentos pessoais e trabalhistas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="pis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          PIS <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.00000.00-0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handlePISChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ctpsNumero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CTPS Número <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0000000"
                            maxLength={7}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleCTPS(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ctpsSerie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CTPS Série <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="0000" maxLength={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="certificadoReservista"
                  render={({ field }) => (
                    <FormItem className="md:w-1/2">
                      <FormLabel>
                        Certificado de Reservista{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Número do certificado de reservista"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
                <CardDescription>
                  Dados relacionados ao trabalho e função
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="regimeContratacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Regime de Contratação{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o regime" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={RegimeContratacao.CLT}>
                              CLT
                            </SelectItem>
                            <SelectItem value={RegimeContratacao.PJ}>
                              Pessoa Jurídica
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataAdmissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Data de Admissão{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>
                          Salário (R$) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            value={field.value}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              field.onChange(floatValue ?? 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="valorAlimentacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor Alimentação (R$){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            value={field.value}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              field.onChange(floatValue ?? 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valorTransporte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor Transporte (R$){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            value={field.value}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              field.onChange(floatValue ?? 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="funcao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Função <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Função do funcionário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map(({ id, nome }) => (
                              <SelectItem key={id} value={id}>
                                {nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="setor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Setor <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o setor de trabalho" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(({ id, nome }) => (
                              <SelectItem key={id} value={id}>
                                {nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gestor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Gestor <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome do gestor direto"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cbo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CBO <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cbo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cbos.map(({ id, nome }) => (
                              <SelectItem key={id} value={id}>
                                {nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cargaHoraria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Carga Horária Semanal{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="44"
                            placeholder="40"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="escala"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Escala de Trabalho{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a escala" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Escala.SEIS_UM}>6x1</SelectItem>
                            <SelectItem value={Escala.DOZE_TRINTA_SEIS}>
                              12x36
                            </SelectItem>
                            <SelectItem value={Escala.QUATRO_TRES}>
                              4x3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="centroCusto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centro de Custo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o centro de custo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {costCenters.map(({ id, nome }) => (
                              <SelectItem key={id} value={id}>
                                {nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vencimentoExperiencia1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Vencimento 1º Período de Experiência
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vencimentoExperiencia2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Vencimento 2º Período de Experiência
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dataExameAdmissional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Exame Admissional</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataUltimoASO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Último ASO</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataExameDemissional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Exame Demissional</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
                <CardDescription>
                  Informações de contato do funcionário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="celular"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Celular <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleMobilePhoneChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone Residencial</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 0000-0000"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handlePhoneChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Endereço residencial do funcionário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="rua"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          Rua <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Número <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complemento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Apto, casa..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Bairro <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cidade <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Estado <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estados.map(({ uf, nome }) => (
                              <SelectItem key={uf} value={uf}>
                                {nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CEP <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleCepChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantidadeOnibus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Ônibus</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Quantos ônibus o funcionário pega para chegar ao
                          trabalho
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            placeholder="-23.550520"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange(undefined);
                              } else if (validateLatitude(value)) {
                                field.onChange(Number.parseFloat(value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Valor entre -90 e +90 graus
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            placeholder="-46.633309"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange(undefined);
                              } else if (validateLongitude(value)) {
                                field.onChange(Number.parseFloat(value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Valor entre -180 e +180 graus
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar Funcionário"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
