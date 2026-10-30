
import type { ColumnDef } from "@tanstack/react-table";

import type { Product } from "../types/product.types";
import { ProductActions } from "./product-actions";

type ProductColumnKey = "title" | "price";

export function createProductColumns(
  t: (key: ProductColumnKey) => string,
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
