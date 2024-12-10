import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "../button"
import { FilterConfig } from "@/types/data-table"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters?: FilterConfig[]
  filterMessage?: string
}

export function DataTableToolbar<TData>({
  table,
  filters,
  filterMessage = "Filtruoti pagal:",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <p>{filterMessage}</p>
        {filters?.map((filter) => {
          const column = table.getColumn(filter.columnId)
          if (!column) return null

          return (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              icon={filter.icon}
              options={filter.options}
            />
          )
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Atstatyti
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}