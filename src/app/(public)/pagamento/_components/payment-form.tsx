"use client";

import type React from "react";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type {
  AddressFormData,
  PaymentFormData,
} from "../schemas/validation-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, CreditCard, Lock } from "lucide-react";
import { formatCardNumber } from "../utils/checkout-utils";
import BillingAddressForm from "./billing-address-form";

interface PaymentFormProps {
  form: UseFormReturn<PaymentFormData>;
  onSubmit: () => void;
  onBack: () => void;
  customerAddress: AddressFormData;
}

export default function PaymentForm({
  form,
  onSubmit,
  onBack,
  customerAddress,
}: PaymentFormProps) {
  const sameAddress = form.watch("sameAddress");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    form.setValue("cardNumber", formattedValue, { shouldValidate: true });
  };

  useEffect(() => {
    if (sameAddress) {
      form.setValue("billingAddress", customerAddress);
      form.clearErrors("billingAddress");
    }
  }, [sameAddress, customerAddress, form]);

  const handleSubmit = form.handleSubmit(() => {
    onSubmit();
  });

  const handleSameAddressChange = (checked: boolean) => {
    form.setValue("sameAddress", checked, { shouldValidate: true });

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
                <FormLabel>
                  Nome no cartão <span className="text-red-500">*</span>
                </FormLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>
                    Número do cartão <span className="text-red-500">*</span>
                  </FormLabel>
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

            <div className="md:col-span-1 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mês <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = (i + 1).toString().padStart(2, "0");
                          return (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ano <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>
                    CVV <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} maxLength={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
