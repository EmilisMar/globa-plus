"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DataTableToolbar } from "./data-table-toolbar"
import { FilterConfig, Visit } from "@/types/data-table"
import NoData from "@/components/no-data"
import { VisitCard } from "@/app/dashboard/visits/visits"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  filters?: FilterConfig[];
  onFilterChange?: (columnId: string, values: string[]) => void;
  isMobile?: boolean;
}

export function DataTable<TData>({ columns, data, filters, onFilterChange, isMobile }: DataTableProps<TData>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      {filters && <DataTableToolbar table={table} filters={filters} onFilterChange={onFilterChange} />}
      {isMobile ? (
        table.getRowModel().rows.map((row) => (
          console.log(row.original),
          <VisitCard key={row.id} visit={row.original as Visit} />
        ))
      ) : (
        <>
          {table.getRowModel().rows.length ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-[#D8E8F6]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id} className="text-black font-bold text-center">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody className="bg-white">
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/100"
                  onClick={() => table.previousPage()}
                  // disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-white"
                  size="sm"
                  onClick={() => table.nextPage()}
                  // disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <NoData />
          )}
        </>
      )}
    </div>
  )
}
