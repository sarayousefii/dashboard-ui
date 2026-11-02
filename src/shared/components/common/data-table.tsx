
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Props<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  columns,
  data,
  onRowClick,
}: Props<TData>) {
  // TanStack Table's API is intentionally used here. React Compiler skips
  // memoizing this component because useReactTable returns non-memoizable APIs.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="border-b bg-muted/40 px-4 py-3 text-start font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={(event) => {
                if (!onRowClick) return;

                const target = event.target;

                if (
                  target instanceof Element &&
                  target.closest(
                    "button, a, [role='menuitem'], input, select, textarea",
                  )
                ) {
                  return;
                }

                onRowClick(row.original);
              }}
              onKeyDown={(event) => {
                if (
                  !onRowClick ||
                  event.target !== event.currentTarget
                ) {
                  return;
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onRowClick(row.original);
                }
              }}
              className={
                onRowClick
                  ? "cursor-pointer hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  : "hover:bg-muted/30"
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className="border-b px-4 py-3"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
