"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserFormModal, type User } from "@/components/user-form-modal";
import { toast } from "sonner";
import { UsersDataTable } from "./_components/users-data-table";
import { userService } from "@/lib/user-services";
import DashboardLayout from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Falha ao carregar usuários.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (newUser: User): Promise<void> => {
    try {
      setIsLoading(true);

      const userData = {
        nome: newUser.nome,
        email: newUser.email,
        funcao: newUser.funcao,
        senha: "Administrador",
      };

      const responseUser = await userService.createUser(userData);
      if (!responseUser.success) {
        toast.error(responseUser.message);
        return;
      }

      toast.success(responseUser.message);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (updatedUser: User): Promise<void> => {
    try {
      setIsLoading(true);
      await userService.updateUser({
        ...updatedUser,
        id: String(updatedUser.id),
      });

      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast.success("Usuário atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      toast.error("Erro ao atualizar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
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
                  onEdit={(user) => {
                    setSelectedUser(user);
                    setIsEditModalOpen(true);
                  }}
                />
              </div>
            ) : (
              <UsersDataTable
                data={users}
                onEdit={(user) => {
                  setSelectedUser(user);
                  setIsEditModalOpen(true);
                }}
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
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
