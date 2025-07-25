"use client";

import * as React from "react";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import type { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  // Generate options dynamically from column values
  const options = React.useMemo(() => {
    if (!facets) return [];

    return Array.from(facets.keys())
      .filter((value) => value !== undefined && value !== null && value !== "")
      .map((value) => {
        // For special cases where we need to map values to labels
        let label = String(value);

        // Handle specific columns with known mappings
        if (column?.id === "role") {
          const roleMap: Record<string, string> = {
            admin: "Administrador da empresa",
            manager: "Gestor de funcionários",
            viewer: "Visualizador",
          };
          label = roleMap[label] || label;
        } else if (column?.id === "status") {
          const statusMap: Record<string, string> = {
            ativo: "Ativo",
            inativo: "Inativo",
          };
          label = statusMap[label] || label;
        } else if (column?.id === "taxRegime") {
          const taxRegimeMap: Record<string, string> = {
            simples: "Simples Nacional",
            lucro_presumido: "Lucro Presumido",
            lucro_real: "Lucro Real",
          };
          label = taxRegimeMap[label] || label;
        } else if (column?.id === "type") {
          const typeMap: Record<string, string> = {
            falta: "Falta",
            atestado: "Atestado",
            promocao: "Promoção",
            demissao: "Demissão",
            analiseCPF: "Análise de CPF",
            acidente: "Acidente",
            atualizacaoProjeto: "Atualização de Projeto",
            advertencia: "Advertência",
            acaoTrabalhista: "Ação Trabalhista",
            epi: "EPI",
            ferias: "Férias",
          };
          label = typeMap[label] || label;
        } else if (column?.id === "dismissalType") {
          const dismissalTypeMap: Record<string, string> = {
            voluntaria: "Voluntária",
            justa_causa: "Justa Causa",
            sem_justa_causa: "Sem Justa Causa",
          };
          label = dismissalTypeMap[label] || label;
        } else if (column?.id === "cpfStatus") {
          const cpfStatusMap: Record<string, string> = {
            regular: "Regular",
            irregular: "Irregular",
          };
          label = cpfStatusMap[label] || label;
        }

        return {
          label,
          value: String(value),
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [facets, column]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selecionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
