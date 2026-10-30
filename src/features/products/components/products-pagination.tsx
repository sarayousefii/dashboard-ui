"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  setPage: (value: number) => void;
};

export function ProductsPagination({
  page,
  setPage,
}: Props) {
  const t = useTranslations("products.pagination");

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        {t("previous")}
      </Button>

      <span>{t("page", { page })}</span>

      <Button
        variant="outline"
        onClick={() => setPage(page + 1)}
      >
        {t("next")}
      </Button>
    </div>
  );
}