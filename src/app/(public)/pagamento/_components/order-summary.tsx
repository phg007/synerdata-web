"use client";

import { Check, X } from "lucide-react";
import {
  calculatePrice,
  formatCurrency,
  getPlanBadgeColors,
} from "../utils/checkout-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFeaturesForPlan } from "@/lib/get-features-for-plan";

interface OrderSummaryProps {
  employeeCount: string;
  setEmployeeCount: (value: string) => void;
  planType: string;
  planIndex: number;
}

export default function OrderSummary({
  employeeCount,
  setEmployeeCount,
  planType,
  planIndex,
}: OrderSummaryProps) {
  const monthlyPrice = calculatePrice(planType, employeeCount);
  const planColors = getPlanBadgeColors(planType);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xl sticky top-4">
      <h2 className="text-xl font-semibold mb-6">Resumo do pedido</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 text-sm">Plano</span>
          <span className={`${planColors.text} font-medium text-sm`}>
            {planType}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-600 text-sm">
            Quantidade de funcionários
          </span>
          <Select value={employeeCount} onValueChange={setEmployeeCount}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Até 50">Até 50</SelectItem>
              <SelectItem value="51-100">51-100</SelectItem>
              <SelectItem value="101-150">101-150</SelectItem>
              <SelectItem value="151-200">151-200</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
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
      </div>

      <div className="border-t border-slate-200 pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600">Valor mensal</span>
          <span className="text-lg font-bold">
            {formatCurrency(monthlyPrice)}
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Ao finalizar sua compra, você concorda com nossos Termos de Serviço e
        Política de Privacidade.
      </div>
    </div>
  );
}
