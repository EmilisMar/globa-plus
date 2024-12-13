import { Column } from "@tanstack/react-table"
import { Check, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "../badge"
import { Button } from "../button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover"
import { Separator } from "../separator"

interface DataTableFacetedFilterProps {
  column?: Column<any>;
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
  icon?: LucideIcon;
  selectedValues?: string[];
  onFilterChange?: (values: string[]) => void;
}

export function DataTableFacetedFilter({
  title,
  options,
  icon: Icon,
  selectedValues = [],
  onFilterChange,
}: DataTableFacetedFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-white border-0">
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {title}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {selectedValues.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        onFilterChange?.(
                          selectedValues.filter((value) => value !== option.value)
                        );
                      } else {
                        onFilterChange?.([...selectedValues, option.value]);
                      }
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
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}