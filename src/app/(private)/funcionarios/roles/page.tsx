"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoleFormModal } from "./components/features/role-form-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { RolesDataTable } from "./components/roles-data-table";
import DashboardLayout from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  type Role,
} from "@/lib/role-service";

export default function RolesPage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  // Função para carregar cargos - definida com useCallback para evitar recriações
  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getRoles();
      setRoles(data);
      return true;
    } catch (error) {
      console.error("Erro ao carregar cargos:", error);
      setIsError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar cargos ao inicializar a página
  useEffect(() => {
    fetchRoles().then((success) => {
      if (!success) {
        toast.error("Erro ao carregar cargos. Tente novamente mais tarde.");
      }
    });
  }, [fetchRoles]);

  // Adicionar novo cargo
  const handleAddRole = async (
    newRoleData: Omit<Role, "id">
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const addedRole = await createRole(newRoleData);
      setRoles((prev) => [...prev, addedRole]);
      toast.success("Cargo adicionado com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar cargo:", error);
      toast.error("Erro ao adicionar cargo. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsRoleFormOpen(false);
    }
  };

  // Editar cargo
  const handleEditRole = (role: Role): void => {
    setSelectedRole(role);
    setIsRoleFormOpen(true);
  };

  // Atualizar cargo
  const handleUpdateRole = async (updatedRole: Role): Promise<void> => {
    try {
      setIsLoading(true);
      await updateRole(updatedRole);
      setRoles((prev) =>
        prev.map((r) => (r.id === updatedRole.id ? updatedRole : r))
      );
      toast.success("Cargo atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar cargo:", error);
      toast.error("Erro ao atualizar cargo. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsRoleFormOpen(false);
      setSelectedRole(null);
    }
  };

  // Preparar exclusão de cargo
  const handleDeleteRole = (role: Role): void => {
    setRoleToDelete(role);
    setIsConfirmationModalOpen(true);
  };

  // Confirmar exclusão de cargo
  const confirmDeleteRole = async (): Promise<void> => {
    if (!roleToDelete) return;

    try {
      setIsLoading(true);
      await deleteRole(roleToDelete.id);
      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
      toast.success("Cargo excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir cargo:", error);
      toast.error("Erro ao excluir cargo. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsConfirmationModalOpen(false);
      setRoleToDelete(null);
    }
  };

  // Recarregar dados
  const handleRefresh = async (): Promise<void> => {
    const success = await fetchRoles();
    if (success) {
      toast.success("Dados atualizados com sucesso");
    }
  };

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Cargos Cadastrados</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsRoleFormOpen(true)}
                  disabled={isLoading}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Cargo
                </Button>
              </div>
            </div>

            {isError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-red-500 mb-4">
                  Ocorreu um erro ao carregar os dados.
                </p>
                <Button onClick={handleRefresh}>Tentar novamente</Button>
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <RolesDataTable
                data={roles}
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
              />
            )}
          </div>

          <RoleFormModal
            isOpen={isRoleFormOpen}
            onClose={() => {
              setIsRoleFormOpen(false);
              setSelectedRole(null);
            }}
            onAddRole={handleAddRole}
            onUpdateRole={handleUpdateRole}
            role={selectedRole}
          />

          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={confirmDeleteRole}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir o cargo ${roleToDelete?.nome}?`}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
