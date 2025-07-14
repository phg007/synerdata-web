"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps<T> {
  items: T[];
  value: string[];
  onChange: (value: string[]) => void;
  getItemValue: (item: T) => string;
  getItemLabel: (item: T) => string;
  getSearchValue?: (item: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect<T>({
  items,
  value,
  onChange,
  getItemValue,
  getItemLabel,
  getSearchValue,
  placeholder = "Selecione itens...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum item encontrado.",
  className,
  disabled = false,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const handleSelect = (itemValue: string) => {
    const newValue = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue];
    onChange(newValue);
  };

  const handleRemove = (itemValue: string) => {
    onChange(value.filter((v) => v !== itemValue));
  };

  const selectedItems = items.filter((item) =>
    value.includes(getItemValue(item))
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-200"
            disabled={disabled}
          >
            {value.length === 0 ? (
              <span className="font-normal">{placeholder}</span>
            ) : (
              <span className="font-normal">
                {value.length} item(s) selecionado(s)
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className="border-none focus:ring-0 focus:outline-none"
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => {
                  const itemValue = getItemValue(item);
                  const itemLabel = getItemLabel(item);
                  const searchValue = getSearchValue
                    ? getSearchValue(item)
                    : itemLabel;

                  return (
                    <CommandItem
                      key={itemValue}
                      value={searchValue}
                      onSelect={() => handleSelect(itemValue)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(itemValue)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {itemLabel}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => {
            const itemValue = getItemValue(item);
            const itemLabel = getItemLabel(item);

            return (
              <Badge key={itemValue} variant="secondary" className="pr-1">
                {itemLabel}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemove(itemValue)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
