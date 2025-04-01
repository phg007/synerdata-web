"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserFormModal, type User } from "@/components/user-form-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { toast } from "sonner";
import { UsersDataTable } from "./components/users-data-table";
import { userService } from "@/lib/user-services";
import DashboardLayout from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        setIsLoading(true);
        console.log("Fetching users...");

        try {
          // Try to get data from the API
          const data = await userService.getUsers();
          console.log("Users fetched successfully:", data);
          setUsers(data);
        } catch (apiError) {
          console.warn("Falha na chamada da API:", apiError);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Falha ao carregar usuários. Usando dados locais.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <DashboardLayout>
      <Card className="bg-white h-full">
        <CardContent className="p-4 h-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Usuário Cadastrados</h2>
              <Button onClick={() => setIsUserFormOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
            {isLoading && users.length === 0 ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-amber-500">{error}</p>
                <UsersDataTable
                  data={users}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              </div>
            ) : (
              <UsersDataTable
                data={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            )}
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
    </DashboardLayout>
  );
}
