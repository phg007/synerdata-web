"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEPI } from "../../services/delete-epi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Row } from "@tanstack/react-table";

import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { data: session } = useSession();
  const companyId = session?.user.empresa;

  const queryClient = useQueryClient();

  const { mutateAsync: deleteEpiFn } = useMutation({
    mutationFn: deleteEPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epis", companyId] });

      toast.success("Epi excluída com sucesso.");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir a Epi.", {
        description: error.message,
      });
    },
  });

  async function handleDelete(epiId: string) {
    try {
      await deleteEpiFn({
        epiId,
      });
    } catch (error) {
      console.error("Erro ao excluir a epi:", error);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <Link href={`epis/editar/${row.getValue("id")}`}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir filial</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a Epi?
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
    </>
  );
}
