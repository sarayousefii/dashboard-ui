
"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
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

  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";

  const t = useTranslations("products.actions");

  const {
    mutate: deleteProduct,
    isPending,
  } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu dir={direction}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("open")}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          style={{ direction }}
          className="w-40"
        >
          <DropdownMenuItem asChild>
            <Link
              href={`/products/${id}`}
              className="flex w-full items-center"
            >
              <Eye className="me-2 h-4 w-4 shrink-0" />
              <span>{t("view")}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/products/edit/${id}`}
              className="flex w-full items-center"
            >
              <Pencil className="me-2 h-4 w-4 shrink-0" />
              <span>{t("edit")}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="me-2 h-4 w-4 shrink-0" />
            <span>{t("delete")}</span>
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
