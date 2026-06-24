"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/common/confirm-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteProduct } from "../hooks/use-delete-product";

import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

interface Props {
  id: number;
}

export function ProductActions({ id }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteProduct, isPending } =
    useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">

          <DropdownMenuItem asChild>
            <Link
              href={`/products/${id}`}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/products/edit/${id}`}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-600 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Product"
        description="This action cannot be undone."
        confirmText="Delete"
        loading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}