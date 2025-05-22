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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
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
import type { Employee } from "../app/(private)/funcionarios/_components/employee-form-modal";
import { useEffect, useId } from "react";

// Base schema with common fields
const baseSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string({
    required_error: "Selecione um funcionário",
  }),
});

// Schemas for each occurrence type
const faltaSchema = baseSchema.extend({
  type: z.literal("falta"),
  date: z.string({
    required_error: "Data é obrigatória",
  }),
  reason: z.string().min(1, { message: "Motivo é obrigatório" }),
});

const atestadoSchema = baseSchema.extend({
  type: z.literal("atestado"),
  startDate: z.string({
    required_error: "Data de início é obrigatória",
  }),
  endDate: z.string({
    required_error: "Data de término é obrigatória",
  }),
  reason: z.string().min(1, { message: "Justificativa é obrigatória" }),
});

const promocaoSchema = baseSchema.extend({
  type: z.literal("promocao"),
  newPosition: z.string().min(1, { message: "Nova função é obrigatória" }),
  newSalary: z
    .number()
    .min(1, { message: "Novo salário deve ser maior que zero" }),
  reason: z.string().min(1, { message: "Justificativa é obrigatória" }),
});

const demissaoSchema = baseSchema.extend({
  type: z.literal("demissao"),
  date: z.string({
    required_error: "Data é obrigatória",
  }),
  reason: z.string().min(1, { message: "Motivo é obrigatório" }),
  legalReason: z
    .string()
    .min(1, { message: "Motivo trabalhista é obrigatório" }),
  legalAction: z.string().optional(),
  dismissalType: z.enum(["voluntaria", "justa_causa", "sem_justa_causa"], {
    required_error: "Selecione a forma de demissão",
  }),
});

const analiseCPFSchema = baseSchema.extend({
  type: z.literal("analiseCPF"),
  cpfStatus: z.enum(["regular", "irregular"], {
    required_error: "Selecione o status do CPF",
  }),
  cpfIssues: z.string().optional(),
});

const acidenteSchema = baseSchema.extend({
  type: z.literal("acidente"),
  date: z.string({
    required_error: "Data é obrigatória",
  }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  actionsTaken: z
    .string()
    .min(1, { message: "Medidas tomadas são obrigatórias" }),
});

const atualizacaoProjetoSchema = baseSchema.extend({
  type: z.literal("atualizacaoProjeto"),
  newProject: z.string().min(1, { message: "Novo projeto é obrigatório" }),
  projectStartDate: z.string({
    required_error: "Data de início no novo projeto é obrigatória",
  }),
});

const advertenciaSchema = baseSchema.extend({
  type: z.literal("advertencia"),
  date: z.string({
    required_error: "Data é obrigatória",
  }),
  reason: z.string().min(1, { message: "Motivo é obrigatório" }),
});

const acaoTrabalhistaSchema = baseSchema.extend({
  type: z.literal("acaoTrabalhista"),
  caseDetails: z
    .string()
    .min(1, { message: "Dados do processo são obrigatórios" }),
  caseKnowledgeDate: z.string({
    required_error: "Data do conhecimento é obrigatória",
  }),
});

const epiSchema = baseSchema.extend({
  type: z.literal("epi"),
  date: z.string({
    required_error: "Data é obrigatória",
  }),
  items: z
    .string()
    .min(1, { message: "Itens disponibilizados são obrigatórios" }),
  itemReason: z.enum(
    ["substituicao", "mau_uso", "vencimento", "furto", "roubo"],
    {
      required_error: "Selecione o motivo",
    }
  ),
  responsiblePerson: z
    .string()
    .min(1, { message: "Responsável pela entrega é obrigatório" }),
});

const feriasSchema = baseSchema.extend({
  type: z.literal("ferias"),
  acquisitionPeriod: z
    .string()
    .min(1, { message: "Período aquisitivo é obrigatório" }),
});

// Combine all schemas into a discriminated union
const occurrenceSchema = z.discriminatedUnion("type", [
  faltaSchema,
  atestadoSchema,
  promocaoSchema,
  demissaoSchema,
  analiseCPFSchema,
  acidenteSchema,
  atualizacaoProjetoSchema,
  advertenciaSchema,
  acaoTrabalhistaSchema,
  epiSchema,
  feriasSchema,
]);

export type Occurrence = z.infer<typeof occurrenceSchema>;

type OccurrenceFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddOccurrence: (occurrence: Occurrence) => void;
  employees: Employee[];
  initialData?: Occurrence | null;
};

// Define a type-safe default value for the "falta" occurrence type
const defaultFaltaOccurrence: z.infer<typeof faltaSchema> = {
  type: "falta",
  employeeId: "",
  date: "",
  reason: "",
};

export function OccurrenceFormModal({
  isOpen,
  onClose,
  onAddOccurrence,
  employees,
  initialData,
}: OccurrenceFormModalProps) {
  // Use React's useId for stable, unique IDs
  const formId = useId();

  const form = useForm<Occurrence>({
    resolver: zodResolver(occurrenceSchema),
    defaultValues: initialData || defaultFaltaOccurrence,
  });

  // Use useEffect with a cleanup function
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }

    // Return cleanup function
    return () => {
      // Clean up any resources if needed
    };
  }, [initialData, form]);

  // Update the dialog title based on whether we're editing or adding
  const dialogTitle = initialData
    ? "Editar Ocorrência"
    : "Registrar Nova Ocorrência";
  const dialogDescription = initialData
    ? "Atualize os campos abaixo para editar a ocorrência."
    : "Preencha os campos abaixo para registrar uma nova ocorrência.";

  // Update the submit button text
  const submitButtonText = initialData ? "Atualizar" : "Salvar";

  const occurrenceType = form.watch("type");

  const onSubmit = (data: Occurrence) => {
    // Preserve the ID if we're editing, otherwise generate a new one
    const occurrenceId = initialData?.id || crypto.randomUUID();

    onAddOccurrence({
      ...data,
      id: occurrenceId,
    });

    toast.success(
      initialData
        ? "Ocorrência atualizada com sucesso"
        : "Ocorrência registrada com sucesso"
    );
    onClose();
    form.reset(defaultFaltaOccurrence);
  };

  // Function to handle type change with proper type safety
  const handleTypeChange = (value: string) => {
    // Create a new default value based on the selected type
    const newDefaultValues: Partial<Occurrence> = {
      type: value as Occurrence["type"],
      employeeId: form.getValues("employeeId"),
    };

    form.reset(newDefaultValues as Occurrence);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ocorrência</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleTypeChange(value);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de ocorrência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="falta">Falta</SelectItem>
                      <SelectItem value="atestado">Atestado</SelectItem>
                      <SelectItem value="promocao">Promoção</SelectItem>
                      <SelectItem value="demissao">Demissão</SelectItem>
                      <SelectItem value="analiseCPF">Análise de CPF</SelectItem>
                      <SelectItem value="acidente">Acidente</SelectItem>
                      <SelectItem value="atualizacaoProjeto">
                        Atualização do Projeto
                      </SelectItem>
                      <SelectItem value="advertencia">Advertência</SelectItem>
                      <SelectItem value="acaoTrabalhista">
                        Ação Trabalhista
                      </SelectItem>
                      <SelectItem value="epi">EPI</SelectItem>
                      <SelectItem value="ferias">Férias</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funcionário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {occurrenceType === "falta" && (
              <>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo</FormLabel>
                      <FormControl>
                        <Textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {occurrenceType === "atestado" && (
              <>
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Término</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justificativa</FormLabel>
                      <FormControl>
                        <Textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {occurrenceType === "promocao" && (
              <>
                <FormField
                  control={form.control}
                  name="newPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Função</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Novo Salário</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justificativa</FormLabel>
                      <FormControl>
                        <Textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {occurrenceType === "demissao" && (
              <>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo</FormLabel>
                      <FormControl>
                        <Textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="legalReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo Trabalhista</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="legalAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ação Trabalhista</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dismissalType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Demissão</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a forma de demissão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="voluntaria">Voluntária</SelectItem>
                          <SelectItem value="justa_causa">
                            Justa Causa
                          </SelectItem>
                          <SelectItem value="sem_justa_causa">
                            Sem Justa Causa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {occurrenceType === "analiseCPF" && (
              <>
                <FormField
                  control={form.control}
                  name="cpfStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status do CPF</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status do CPF" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="irregular">Irregular</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpfIssues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problemas ou Restrições</FormLabel>
                      <FormControl>
                        <Textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Add other occurrence type fields as needed */}
            {occurrenceType === "ferias" && (
              <FormField
                control={form.control}
                name="acquisitionPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período Aquisitivo</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit">{submitButtonText}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
