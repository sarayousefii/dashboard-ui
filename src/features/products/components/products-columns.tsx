import type { ColumnDef } from "@tanstack/react-table";

import type { Product } from "../types/product.types";
import { ProductActions } from "./product-actions";

export function createProductColumns(
  t: (key: "title" | "price") => string,
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "title",
      header: t("title"),
    },
    {
      accessorKey: "price",
      header: t("price"),
    },
    {
      id: "actions",
      header: "",
      size: 60,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ProductActions id={row.original.id} />
        </div>
      ),
    },
  ];
}