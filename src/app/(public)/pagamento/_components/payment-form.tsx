"use client";

import type React from "react";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { PaymentFormData } from "../schemas/validation-schemas";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, CreditCard, Lock } from "lucide-react";
import { formatCardNumber, formatExpiryDate } from "../utils/checkout-utils";
import BillingAddressForm from "./billing-address-form";

interface PaymentFormProps {
  form: UseFormReturn<PaymentFormData>;
  onSubmit: () => void;
  onBack: () => void;
}

export default function PaymentForm({
  form,
  onSubmit,
  onBack,
}: PaymentFormProps) {
  const sameAddress = form.watch("sameAddress");

  // Função para lidar com a formatação do número do cartão
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    form.setValue("cardNumber", formattedValue, { shouldValidate: true });
  };

  // Função para lidar com a formatação da data de validade
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    form.setValue("expiryDate", formattedValue, { shouldValidate: true });
  };

  // Efeito para limpar os campos de endereço de cobrança quando sameAddress for true
  useEffect(() => {
    if (sameAddress) {
      form.setValue("billingAddress", {
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
      form.clearErrors("billingAddress");
    }
  }, [sameAddress, form]);

  const handleSubmit = form.handleSubmit(() => {
    onSubmit();
  });

  const handleSameAddressChange = (checked: boolean) => {
    form.setValue("sameAddress", checked, { shouldValidate: true });

    // Se marcar o checkbox, limpa os erros de validação
    if (checked) {
      form.clearErrors("billingAddress");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Informações de pagamento</h2>
          <p className="text-slate-500 text-sm">
            Preencha os dados do seu cartão
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-3">
            <Lock className="h-5 w-5 text-slate-400" />
            <p className="text-sm text-slate-600">
              Seus dados estão protegidos com criptografia de ponta a ponta
            </p>
          </div>

          <FormField
            control={form.control}
            name="cardHolderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome no cartão</FormLabel>
                <FormControl>
                  <Input
                    className="uppercase"
                    placeholder="JOÃO DA SILVA"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Número do cartão</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        onChange={handleCardNumberChange}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CreditCard className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/AA"
                        {...field}
                        onChange={handleExpiryDateChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} maxLength={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <FormField
              control={form.control}
              name="sameAddress"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={handleSameAddressChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      O endereço de cobrança é o mesmo da organização
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {!sameAddress && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium mb-4">
                  Endereço de cobrança
                </h3>
                <BillingAddressForm form={form} />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row md:justify-between gap-3">
          <Button variant="outline" onClick={onBack} type="button">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Button type="submit">
            Revisar pedido <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
