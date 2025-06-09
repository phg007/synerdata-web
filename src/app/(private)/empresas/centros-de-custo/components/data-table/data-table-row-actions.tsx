"use client";

import { Row } from "@tanstack/react-table";
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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCostCenter } from "../../services/delete-cost-center";
import { useSession } from "next-auth/react";
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

  const { mutateAsync: deleteCostCenterFn } = useMutation({
    mutationFn: deleteCostCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-centers", companyId] });

      toast.success("Centro de custo excluído com sucesso.");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir o centro de custo.", {
        description: error.message,
      });
    },
  });

  async function handleDelete(costCenterId: string) {
    try {
      await deleteCostCenterFn({
        costCenterId,
      });
    } catch (error) {
      console.error("Erro ao excluir o centro de custo:", error);
    }
  }

  return (
    <>
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
          <Link href={`centros-de-custo/editar/${row.getValue("id")}`}>
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
                <AlertDialogTitle>Excluir centro de custo</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o centro de custo?
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
