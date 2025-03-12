"use client";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { RowActions } from "./row-actions";
import type { User } from "@/components/user-form-modal";

interface UsersDataTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRoleChange: (
    userId: string,
    newRole: "admin" | "manager" | "viewer"
  ) => void;
  onStatusChange: (userId: string, newStatus: "ativo" | "inativo") => void;
}

export function UsersDataTable({
  data,
  onEdit,
  onDelete,
  onRoleChange,
  onStatusChange,
}: UsersDataTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-mail" />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Função" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            value={user.role}
            onValueChange={(newRole: "admin" | "manager" | "viewer") =>
              onRoleChange(user.id, newRole)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione uma função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador da empresa</SelectItem>
              <SelectItem value="manager">Gestor de funcionários</SelectItem>
              <SelectItem value="viewer">Visualizador</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            value={user.status}
            onValueChange={(newStatus: string) => {
              if (user.id) {
                onStatusChange(user.id, newStatus as "ativo" | "inativo");
              }
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <RowActions
            onEdit={() => onEdit(user)}
            onDelete={() => onDelete(user)}
          />
        );
      },
    },
  ];

  const roleFacetedFilterOptions = [
    { label: "Administrador", value: "admin" },
    { label: "Gestor", value: "manager" },
    { label: "Visualizador", value: "viewer" },
  ];

  const statusFacetedFilterOptions = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Filtrar por nome..."
      facetedFilterColumn="role"
      facetedFilterTitle="Função"
      facetedFilterOptions={roleFacetedFilterOptions}
      additionalFacetedFilters={[
        {
          column: "status",
          title: "Status",
          options: statusFacetedFilterOptions,
        },
      ]}
    />
  );
}
