"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Construction, Clock } from "lucide-react";
import Link from "next/link";

export default function ReportUnderDevelopment() {
  return (
    <div className="flex items-center justify-center h-full min-h-[600px] py-8">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Construction className="h-24 w-24 text-amber-500" />
              <div className="absolute -top-2 -right-2 bg-amber-100 rounded-full p-2">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Relatório pendente
          </h1>

          <p className="text-slate-600 mb-6 leading-relaxed">
            Precisamos apenas que você conclua o preenchimento dos dados de
            funcionários e lançamento das ocorrências. A partir disso,
            começaremos a preparar seu relatório personalizado, pronto em até 7
            dias úteis.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">
              O que você pode esperar:
            </h3>
            <ul className="text-left text-slate-600 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Análises detalhadas dos seus dados
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Visualizações interativas e personalizadas
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Insights em tempo real para tomada de decisões
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Relatórios adaptados ao seu segmento de negócio
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mt-3">
              Tem dúvidas? Nossa equipe está pronta para ajudar.{" "}
              <Link
                href="/contato"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Entre em contato
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
