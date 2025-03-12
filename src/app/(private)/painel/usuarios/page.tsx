"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserFormModal, type User } from "@/components/user-form-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { toast } from "sonner";
// Importe o novo componente
import { UsersDataTable } from "./components/users-data-table";

export default function UsersPage() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
      role: "admin",
      status: "ativo",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@example.com",
      role: "manager",
      status: "ativo",
    },
    {
      id: "3",
      name: "Pedro Oliveira",
      email: "pedro@example.com",
      role: "viewer",
      status: "inativo",
    },
    {
      id: "4",
      name: "Ana Rodrigues",
      email: "ana@example.com",
      role: "admin",
      status: "ativo",
    },
    {
      id: "5",
      name: "Carlos Ferreira",
      email: "carlos@example.com",
      role: "manager",
      status: "inativo",
    },
  ]);

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsEditModalOpen(false);
    setSelectedUser(null);
    toast.success("Usuário atualizado com sucesso");
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      toast.success("Usuário excluído com sucesso");
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, role: newRole as "admin" | "manager" | "viewer" }
          : user
      )
    );
  };

  const handleStatusChange = (
    userId: string,
    newStatus: "ativo" | "inativo"
  ) => {
    if (userId) {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    }
  };

  return (
    <Card className="bg-white h-full">
      <CardContent className="p-4 h-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Usuários Cadastrados</h2>
            <Button onClick={() => setIsUserFormOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </Button>
          </div>
          <UsersDataTable
            data={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
          />
        </div>
        <UserFormModal
          isOpen={isUserFormOpen}
          onClose={() => setIsUserFormOpen(false)}
          onAddUser={handleAddUser}
        />
        <UserFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onAddUser={handleUpdateUser}
          initialData={selectedUser}
        />
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteUser}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o usuário ${selectedUser?.name}?`}
        />
      </CardContent>
    </Card>
  );
}
