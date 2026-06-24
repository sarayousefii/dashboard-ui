"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Props<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({
  columns,
  data,
}: Props<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel:
      getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead>
          {table
            .getHeaderGroups()
            .map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(
                  (header) => (
                    <th
                      key={header.id}
                      style={{
                        width:
                          header.getSize(),
                      }}
                      className="
                        border-b
                        bg-muted/40
                        px-4
                        py-3
                        text-left
                        font-medium
                      "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column
                              .columnDef
                              .header,
                            header.getContext()
                          )}
                    </th>
                  )
                )}
              </tr>
            ))}
        </thead>

        <tbody>
          {table
            .getRowModel()
            .rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/30"
              >
                {row
                  .getVisibleCells()
                  .map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width:
                          cell.column.getSize(),
                      }}
                      className="
                        border-b
                        px-4
                        py-3
                      "
                    >
                      {flexRender(
                        cell.column
                          .columnDef
                          .cell,
                        cell.getContext()
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