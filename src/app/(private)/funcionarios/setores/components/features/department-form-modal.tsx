"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Definindo os tipos
export interface DepartmentFormData {
  nome: string;
  status: "A" | "I";
}

export interface Department extends DepartmentFormData {
  id: string;
  atualizadoEm?: string;
}

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (department: DepartmentFormData) => void;
  onUpdateDepartment: (department: Department) => void;
  department: Department | null;
}

export function DepartmentFormModal({
  isOpen,
  onClose,
  onAddDepartment,
  onUpdateDepartment,
  department,
}: DepartmentFormModalProps) {
  // Estado local para os campos do formulário
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState<"A" | "I">("A");
  const [error, setError] = useState("");

  const isEditing = !!department;

  // Atualiza os campos quando o departmento muda ou o modal é aberto
  useEffect(() => {
    if (isOpen) {
      if (department) {
        setNome(department.nome);
        setStatus(department.status);
      } else {
        setNome("");
        setStatus("A");
      }
      setError("");
    }
  }, [isOpen, department]);

  // Função para validar e enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples
    if (nome.trim().length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres");
      return;
    }

    // Limpa o erro se a validação passar
    setError("");

    // Envia os dados para a função apropriada
    if (isEditing && department) {
      onUpdateDepartment({
        id: department.id,
        nome,
        status,
        atualizadoEm: new Date().toISOString(),
      });
    } else {
      onAddDepartment({ nome, status });
    }

    // Fecha o modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Departmento" : "Adicionar Departmento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do departmento selecionado."
              : "Preencha as informações para adicionar um novo departmento."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do departmento"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "A" | "I")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="A">Ativo</option>
              <option value="I">Inativo</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
