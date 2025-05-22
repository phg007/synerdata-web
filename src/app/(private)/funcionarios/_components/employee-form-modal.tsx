"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useId, useEffect } from "react";

// Update the employee schema to include all the missing fields
const employeeSchema = z.object({
  id: z.string(),
  fullName: z
    .string()
    .min(3, { message: "Nome completo deve ter pelo menos 3 caracteres" }),
  carteiraIdentidade: z.string().optional(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF inválido. Use o formato 000.000.000-00",
  }),
  sexo: z.enum(["Masculino", "Feminino", "Outro"]).optional(),
  birthDate: z.string().refine(
    (date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 100;
    },
    {
      message:
        "Data de nascimento inválida. O funcionário deve ter entre 18 e 100 anos",
    }
  ),
  estadoCivil: z
    .enum([
      "Solteiro(a)",
      "Casado(a)",
      "Divorciado(a)",
      "Viúvo(a)",
      "União Estável",
    ])
    .optional(),
  naturalidade: z.string().optional(),
  nacionalidade: z.string().optional(),
  altura: z.string().optional(),
  peso: z.string().optional(),
  nomePai: z.string().optional(),
  nomeMae: z.string().optional(),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .optional()
    .or(z.literal("")),
  pis: z.string().optional(),
  ctpsNumero: z.string().optional(),
  ctpsSerie: z.string().optional(),
  certificadoReservista: z.string().optional(),
  regimeContratacao: z.string().optional(),
  dataAdmissao: z.string().optional(),
  position: z
    .string()
    .min(2, { message: "Cargo/Função deve ter pelo menos 2 caracteres" }),
  department: z
    .string()
    .min(2, { message: "Setor deve ter pelo menos 2 caracteres" }),
  contractType: z.enum(["CLT", "PJ"]),
  salary: z.number().min(1, { message: "Salário deve ser maior que zero" }),
  dataUltimoASO: z.string().optional(),
  vencimentoExperiencia1: z.string().optional(),
  vencimentoExperiencia2: z.string().optional(),
  dataExameDemissional: z.string().optional(),
  grauInstrucao: z
    .enum([
      "Ensino Fundamental Incompleto",
      "Ensino Fundamental Completo",
      "Ensino Médio Incompleto",
      "Ensino Médio Completo",
      "Ensino Superior Incompleto",
      "Ensino Superior Completo",
      "Pós-graduação",
      "Mestrado",
      "Doutorado",
    ])
    .optional(),
  necessidadesEspeciais: z.string().optional(),
  filhos: z.number().optional(),
  celular: z.string().optional(),
  gestor: z.string().optional(),
  cbo: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  quantidadeOnibus: z.number().optional(),
  cargaHoraria: z.string().optional(),
  escala: z.string().optional(),
  empresa: z.string().optional(),
  criadoPor: z.string().optional(),
  additionalInfo: z.string().optional(),
  projectOrCostCenter: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

type EmployeeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: EmployeeFormValues) => void;
};

export function EmployeeFormModal({
  isOpen,
  onClose,
  onAddEmployee,
}: EmployeeFormModalProps) {
  const formId = useId();

  // Update the defaultValues in the form
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      id: "",
      fullName: "",
      carteiraIdentidade: "",
      cpf: "",
      sexo: undefined,
      birthDate: "",
      estadoCivil: undefined,
      naturalidade: "",
      nacionalidade: "",
      altura: "",
      peso: "",
      nomePai: "",
      nomeMae: "",
      email: "",
      pis: "",
      ctpsNumero: "",
      ctpsSerie: "",
      certificadoReservista: "",
      regimeContratacao: "",
      dataAdmissao: "",
      position: "",
      department: "",
      contractType: "CLT",
      salary: 0,
      dataUltimoASO: "",
      vencimentoExperiencia1: "",
      vencimentoExperiencia2: "",
      dataExameDemissional: "",
      grauInstrucao: undefined,
      necessidadesEspeciais: "",
      filhos: 0,
      celular: "",
      gestor: "",
      cbo: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      quantidadeOnibus: 0,
      cargaHoraria: "",
      escala: "",
      empresa: "",
      criadoPor: "",
      additionalInfo: "",
      projectOrCostCenter: "",
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = (data: EmployeeFormValues) => {
    onAddEmployee(data);
    // Não feche o modal ou resete o formulário aqui - isso será feito pelo componente pai
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo funcionário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Resto do formulário permanece o mesmo */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="000.000.000-00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo/Função</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de contrato</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de contrato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="PJ">PJ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salário</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="carteiraIdentidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carteira de Identidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Outros campos permanecem os mesmos */}
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export type Employee = z.infer<typeof employeeSchema>;
