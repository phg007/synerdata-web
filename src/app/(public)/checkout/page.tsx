"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const plan = searchParams.get("plan") || "Ouro Insights";
  const userCount = searchParams.get("users") || "Até 50";

  const prices = {
    "Ouro Insights": {
      "Até 50": "R$ 399,00",
      "51-100": "R$ 449,90",
      "101-150": "R$ 499,90",
      "151-200": "R$ 559,90",
    },
    "Diamante Analytics": {
      "Até 50": "R$ 499,00",
      "51-100": "R$ 559,90",
      "101-150": "R$ 619,90",
      "151-200": "R$ 689,90",
    },
    "Platina Vision": {
      "Até 50": "R$ 599,00",
      "51-100": "R$ 669,90",
      "101-150": "R$ 739,90",
      "151-200": "R$ 821,90",
    },
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsProcessing(true);
    // Simular processamento de pagamento
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/success");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container max-w-6xl py-8">
        <Link
          href="/"
          className="inline-flex items-center text-white hover:text-white/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Synerdata
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Left Column - Plan Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">
              Finalize sua compra
            </h1>
            <Card>
              <CardHeader>
                <CardTitle>Plano Selecionado</CardTitle>
                <CardDescription>Detalhes do plano e preço</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{plan}</span>
                  <span className="font-medium">
                    {
                      prices[plan as keyof typeof prices][
                        userCount as keyof (typeof prices)[keyof typeof prices]
                      ]
                    }
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Check className="mr-2 h-4 w-4" />
                    {userCount} usuários
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Check className="mr-2 h-4 w-4" />
                    Suporte 24/7
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Check className="mr-2 h-4 w-4" />
                    Atualizações gratuitas
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Pagamento</CardTitle>
              <CardDescription>Preencha os dados do seu cartão</CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card">Número do Cartão</Label>
                  <div className="relative">
                    <Input
                      id="card"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Image
                        src="/placeholder.svg?height=24&width=36"
                        alt="Card"
                        width={36}
                        height={24}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Validade</Label>
                    <Input id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">CEP</Label>
                    <Input id="zip" placeholder="12345-678" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processando..." : "Pagar"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
