import { z } from "zod";
import { isValidCNPJ } from "../utils/checkout-utils";

export const addressSchema = z.object({
  zipCode: z.string().min(8, "CEP inválido").max(9),
  street: z.string().min(3, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});
export type AddressFormData = z.infer<typeof addressSchema>;

export const customerSchema = z.object({
  companyName: z.string().min(3, "Nome da empresa é obrigatório"),
  tradeName: z.string().min(3, "Nome fantasia é obrigatório"),
  cnpj: z
    .string()
    .min(14, "CNPJ inválido")
    .max(18)
    .refine((val) => isValidCNPJ(val), {
      message: "CNPJ inválido",
    }),
  email: z.string().email("E-mail inválido"),
  phones: z.object({
    homePhone: z
      .string()
      .max(14, "Telefone inválido")
      .refine((val) => val === "" || val.length >= 14, {
        message: "Telefone inválido",
      }),
    mobilePhone: z.string().min(15, "Celular inválido").max(15),
  }),
  address: addressSchema,
});
export type CustomerFormData = z.infer<typeof customerSchema>;

export const paymentSchema = z
  .object({
    cardHolderName: z.string().min(3, "Nome no cartão é obrigatório"),
    cardNumber: z.string().min(16, "Número do cartão inválido").max(19),
    expiryDate: z
      .string()
      .regex(/^\d{2}\/\d{2}$/, "Formato inválido (MM/AA)")
      .refine(
        (val) => {
          const [month] = val.split("/");
          const monthNum = Number(month);
          return monthNum >= 1 && monthNum <= 12;
        },
        {
          message: "Mês inválido (use valores entre 01 e 12)",
        }
      ),
    cvv: z.string().min(3, "CVV inválido").max(4),
    sameAddress: z.boolean(),
    billingAddress: z.object({
      zipCode: z.string().optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      neighborhood: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    // Se o endereço for o mesmo, não precisamos validar
    if (data.sameAddress) return;

    // Validação do CEP
    if (!data.billingAddress?.zipCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CEP é obrigatório",
        path: ["billingAddress", "zipCode"],
      });
    } else if (data.billingAddress.zipCode.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CEP inválido",
        path: ["billingAddress", "zipCode"],
      });
    }

    // Validação do endereço
    if (!data.billingAddress?.street) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Endereço é obrigatório",
        path: ["billingAddress", "street"],
      });
    } else if (data.billingAddress.street.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Endereço deve ter pelo menos 3 caracteres",
        path: ["billingAddress", "street"],
      });
    }

    // Validação do número
    if (!data.billingAddress?.number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número é obrigatório",
        path: ["billingAddress", "number"],
      });
    }

    // Validação do bairro
    if (!data.billingAddress?.neighborhood) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bairro é obrigatório",
        path: ["billingAddress", "neighborhood"],
      });
    } else if (data.billingAddress.neighborhood.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bairro deve ter pelo menos 2 caracteres",
        path: ["billingAddress", "neighborhood"],
      });
    }

    // Validação da cidade
    if (!data.billingAddress?.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cidade é obrigatória",
        path: ["billingAddress", "city"],
      });
    } else if (data.billingAddress.city.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cidade deve ter pelo menos 2 caracteres",
        path: ["billingAddress", "city"],
      });
    }

    // Validação do estado
    if (!data.billingAddress?.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Estado é obrigatório",
        path: ["billingAddress", "state"],
      });
    }
  });
export type PaymentFormData = z.infer<typeof paymentSchema>;
