"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Send, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateUserDialog from "../edit-branch-dialog";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../services/delete-user";
import { resendInviteUser } from "../../services/resend-invite-user";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const companyId = row.getValue("empresa") as string;
  const [updateUserDialogOpen, setUpdateUserDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: resendInviteUserFn } = useMutation({
    mutationFn: resendInviteUser,
    onSuccess: () => {
      toast.success("Convite reenviado com sucesso.");
    },
    onError: (error: Error) => {
      toast.error("Erro reenviar o convite.", {
        description: error.message,
      });
    },
  });

  const { mutateAsync: deleteUserFn } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", companyId] });

      toast.success("Usuário excluído com sucesso.");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir o usuário.", {
        description: error.message,
      });
    },
  });

  async function handleResendInvite(email: string) {
    try {
      await resendInviteUserFn({
        email,
      });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  }

  async function handleDelete(userId: string) {
    try {
      await deleteUserFn({
        userId,
      });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <Dialog
          open={updateUserDialogOpen}
          onOpenChange={setUpdateUserDialogOpen}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </DialogTrigger>
          <UpdateUserDialog
            userId={row.getValue("id")}
            companyId={companyId}
            setOpen={setUpdateUserDialogOpen}
          />
        </Dialog>
        {row.getValue("status") === "P" && (
          <DropdownMenuItem
            onSelect={() => handleResendInvite(row.getValue("email"))}
          >
            <Send className="mr-2 h-4 w-4" />
            Reenviar convite
          </DropdownMenuItem>
        )}
        <AlertDialog>
          {row.getValue("Função") !== "ADMIN" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o usuário?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className={buttonVariants({ variant: "destructive" })}
                onClick={() => handleDelete(row.getValue("id"))}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
