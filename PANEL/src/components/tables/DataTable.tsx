"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  initialPageSize?: number;
  initialSorting?: SortingState;
  hideSearch?: boolean;
  hideRowsPerPage?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search records",
  emptyTitle = "No results",
  emptyDescription = "No records match your filters yet.",
  initialPageSize = 8,
  initialSorting = [],
  hideSearch = false,
  hideRowsPerPage = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const text = row
        .getAllCells()
        .map((cell) => String(cell.getValue() ?? ""))
        .join(" ")
        .toLowerCase();

      return text.includes((filterValue || "").toLowerCase());
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
  });

  const rowCount = table.getRowModel().rows.length;
  const skeletonRows = useMemo(
    () => Array.from({ length: table.getState().pagination.pageSize }),
    [table],
  );

  return (
    <div className="space-y-4">
      {!hideSearch || !hideRowsPerPage ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {!hideSearch ? (
            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search table"
              className="max-w-sm"
            />
          ) : (
            <div />
          )}

          {!hideRowsPerPage ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>
              <select
                aria-label="Rows per page"
                value={table.getState().pagination.pageSize}
                onChange={(event) => table.setPageSize(Number(event.target.value))}
                className="focus-ring rounded-md border border-border bg-surface px-2 py-1"
              >
                {[5, 8, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();

                  return (
                    <th key={header.id} className="px-4 py-3 font-semibold">
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="focus-ring inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-muted"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <ArrowUpDown className="size-3.5" aria-hidden />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {isLoading
              ? skeletonRows.map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  <td colSpan={columns.length} className="px-4 py-3">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
              : table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors duration-200 hover:bg-muted/35"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && rowCount === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : null}

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
