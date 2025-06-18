"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Building2,
  MapPin,
  CreditCard,
  CheckCircle2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import type {
  CustomerFormData,
  PaymentFormData,
} from "../schemas/validation-schemas";
import {
  calculatePrice,
  formatCurrency,
  getPlanBadgeColors,
} from "../utils/checkout-utils";
import { getFeaturesForPlan } from "@/app/page";

interface ReviewStepProps {
  customerData: CustomerFormData;
  paymentData: PaymentFormData;
  employeeCount: string;
  isProcessing: boolean;
  processingStep?: string | null;
  planType: string;
  planIndex: number;
  onSubmit: () => void;
  onBack: () => void;
}

export default function ReviewStep({
  customerData,
  paymentData,
  employeeCount,
  isProcessing,
  onSubmit,
  onBack,
  planType,
  planIndex,
}: ReviewStepProps) {
  const planColors = getPlanBadgeColors(planType);
  const monthlyPrice = calculatePrice(planType, employeeCount);

  // Função para mascarar o número do cartão
  const maskCardNumber = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    const lastFour = cleanNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Revisão do pedido</h2>
        <p className="text-slate-500 text-sm">
          Verifique os dados antes de finalizar sua compra
        </p>
      </div>

      <div className="space-y-6">
        {/* Dados da empresa */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center mb-3">
            <Building2 className="h-5 w-5 text-slate-500 mr-2" />
            <h3 className="font-medium">Dados da organização</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-slate-500">Empresa:</span>{" "}
              <span className="font-medium">{customerData.companyName}</span>
            </div>
            <div>
              <span className="text-slate-500">CNPJ:</span>{" "}
              <span className="font-medium">{customerData.cnpj}</span>
            </div>
            <div>
              <span className="text-slate-500">E-mail:</span>{" "}
              <span className="font-medium">{customerData.email}</span>
            </div>
            <div>
              <span className="text-slate-500">Telefone:</span>{" "}
              <span className="font-medium">
                {customerData.phones.homePhone}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Celular:</span>{" "}
              <span className="font-medium">
                {customerData.phones.mobilePhone}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 text-slate-500 mr-2" />
              <h4 className="font-medium">Endereço</h4>
            </div>

            <div className="text-sm">
              <p>
                {customerData.address.street}, {customerData.address.number}
                {customerData.address.complement &&
                  `, ${customerData.address.complement}`}
              </p>
              <p>
                {customerData.address.neighborhood} -{" "}
                {customerData.address.city}/{customerData.address.state}
              </p>
              <p>CEP: {customerData.address.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Dados de pagamento */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center mb-3">
            <CreditCard className="h-5 w-5 text-slate-500 mr-2" />
            <h3 className="font-medium">Dados de pagamento</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-slate-500">Titular:</span>{" "}
              <span className="font-medium uppercase">
                {paymentData.cardHolderName}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Cartão:</span>{" "}
              <span className="font-medium">
                {maskCardNumber(paymentData.cardNumber)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Validade:</span>{" "}
              <span className="font-medium">{paymentData.expiryDate}</span>
            </div>
          </div>

          {!paymentData.sameAddress && paymentData.billingAddress && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-slate-500 mr-2" />
                <h4 className="font-medium">Endereço de cobrança</h4>
              </div>

              <div className="text-sm">
                <p>
                  {paymentData.billingAddress.street},{" "}
                  {paymentData.billingAddress.number}
                  {paymentData.billingAddress.complement &&
                    `, ${paymentData.billingAddress.complement}`}
                </p>
                <p>
                  {paymentData.billingAddress.neighborhood} -{" "}
                  {paymentData.billingAddress.city}/
                  {paymentData.billingAddress.state}
                </p>
                <p>CEP: {paymentData.billingAddress.zipCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Resumo do plano */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center mb-3">
            <div
              className={`h-5 w-5 rounded-full ${planColors.bg} ${planColors.text} flex items-center justify-center mr-2`}
            >
              <CheckCircle2 className="h-3 w-3" />
            </div>
            <h3 className="font-medium">Resumo do plano</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-slate-500">Plano:</span>{" "}
              <span className="font-medium">{planType}</span>
            </div>
            <div>
              <span className="text-slate-500">Funcionários:</span>{" "}
              <span className="font-medium">{employeeCount}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 space-y-3">
            <h4 className="font-medium">Recursos incluídos:</h4>
            <ul className="space-y-2 text-sm">
              {getFeaturesForPlan(planIndex).map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  {feature.available ? (
                    <Check className="mr-2 h-4 w-4 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <X className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
                  )}
                  <span
                    className={`flex-grow ${!feature.available ? "text-slate-400 line-through" : ""}`}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-lg">
                {formatCurrency(monthlyPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col md:flex-row md:justify-between gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          disabled={isProcessing}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finalizar compra
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
