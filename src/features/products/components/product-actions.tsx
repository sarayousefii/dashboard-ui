"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/common/confirm-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteProduct } from "../hooks/use-delete-product";

import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

interface Props {
  id: number;
}

export function ProductActions({ id }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("products.actions");

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
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("open")}
          >
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
              {t("view")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/products/edit/${id}`}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              {t("edit")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmText={t("confirmDelete")}
        loading={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}