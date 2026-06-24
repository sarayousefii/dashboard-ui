import { ColumnDef } from "@tanstack/react-table";

import { Product } from "../types/product.types";

import { ProductActions } from "./product-actions";

export const productColumns : ColumnDef<Product>[] =
  [
    {
      accessorKey: "title",
      header: "Title",
    },

    {
      accessorKey: "price",
      header: "Price",
    },
    {
      id: "actions",

      header: "",

      size: 60,

      cell: ({ row }) => (
        <div className="flex justify-center">
          <ProductActions
            id={row.original.id}
          />
        </div>
      ),
    }
  ];