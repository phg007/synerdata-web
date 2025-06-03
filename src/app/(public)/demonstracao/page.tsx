"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Simulação de horários disponíveis
const availableSlots = [
  { date: "2024-12-05", time: "09:00" },
  { date: "2024-12-05", time: "11:00" },
  { date: "2024-12-05", time: "14:00" },
  { date: "2024-12-06", time: "10:00" },
  { date: "2024-12-06", time: "13:00" },
  { date: "2024-12-06", time: "15:00" },
];

export default function SolicitarDemonstracao() {
  const searchParams = useSearchParams();
  const plano = searchParams.get("plano") || "Não especificado";
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nome = formData.get("nome");
    const empresa = formData.get("empresa");
    const email = formData.get("email");
    const funcionarios = formData.get("funcionarios");

    // Simular agendamento no Google Calendar
    console.log("Agendando reunião no Google Calendar...");
    console.log(`Plano: ${plano}`);
    console.log(`Nome: ${nome}`);
    console.log(`Empresa: ${empresa}`);
    console.log(`E-mail: ${email}`);
    console.log(`Número de funcionários: ${funcionarios}`);
    console.log(`Horário selecionado: ${selectedSlot}`);

    // Aqui você adicionaria a lógica real de integração com o Google Calendar
    alert(
      "Demonstração agendada com sucesso! Verifique seu e-mail para mais detalhes."
    );
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">Solicitar Demonstração</CardTitle>
          <CardDescription>Plano selecionado: {plano}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" name="empresa" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funcionarios">Número de funcionários</Label>
              <Select name="funcionarios" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50</SelectItem>
                  <SelectItem value="51-100">51-100</SelectItem>
                  <SelectItem value="101-500">101-500</SelectItem>
                  <SelectItem value="501+">501+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Agendar demonstração</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedSlot ? (
                      selectedSlot
                    ) : (
                      <span>Selecione um horário</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="grid gap-2 p-4">
                    {availableSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start font-normal"
                        onClick={() =>
                          setSelectedSlot(`${slot.date} ${slot.time}`)
                        }
                      >
                        {selectedSlot === `${slot.date} ${slot.time}` && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        {slot.date} - {slot.time}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Agendar Demonstração
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
