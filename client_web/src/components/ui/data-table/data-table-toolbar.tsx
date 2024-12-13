import { Table } from "@tanstack/react-table"
import { FilterConfig } from "@/types/data-table"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters: FilterConfig[]
  onFilterChange?: (columnId: string, values: string[]) => void
}

export function DataTableToolbar<TData>({
  table,
  filters,
  onFilterChange,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2">
          <div className="hidden text-base text-black mb-2 w-full md:block">
            Filtruoti pagal:
          </div>
          {filters.map((filter) => (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={table.getColumn(filter.columnId)}
              title={filter.title}
              options={filter.options}
              icon={filter.icon}
              selectedValues={filter.selectedValues}
              onFilterChange={(values) => onFilterChange?.(filter.columnId, values)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}