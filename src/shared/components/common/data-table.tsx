'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface Props<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({ columns, data, onRowClick }: Props<TData>) {
  // TanStack Table's API is intentionally used here. React Compiler skips
  // memoizing this component because useReactTable returns non-memoizable APIs.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[680px] border-collapse text-start">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-border/70 bg-muted/40"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="px-3 py-3 text-start text-xs font-semibold text-muted-foreground sm:px-4"
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
                    "button, a, [role='button'], [role='menuitem'], input, select, textarea",
                  )
                ) {
                  return;
                }

                onRowClick(row.original);
              }}
              onKeyDown={(event) => {
                if (!onRowClick || event.target !== event.currentTarget) {
                  return;
                }

                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick(row.original);
                }
              }}
              className={[
                'border-b border-border/60 last:border-b-0 transition-colors',
                onRowClick
                  ? 'cursor-pointer hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary'
                  : 'hover:bg-muted/30',
              ].join(' ')}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className="px-3 py-3 align-middle text-sm text-foreground sm:px-4"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
