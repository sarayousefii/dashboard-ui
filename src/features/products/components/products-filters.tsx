"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;
  sortBy?: string;
  order?: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOrderChange: (value: string) => void;
};

export function ProductsFilters({
  search,
  sortBy,
  order,
  onSearchChange,
  onSortChange,
  onOrderChange,
}: Props) {
  const t = useTranslations("products.filters");

  return (
    <div className="flex flex-wrap gap-4">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("search")}
      />

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder={t("sortBy")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="title">{t("title")}</SelectItem>
          <SelectItem value="price">{t("price")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={order || "asc"}
        onValueChange={onOrderChange}
      >
        <SelectTrigger className="w-45">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="asc">{t("ascending")}</SelectItem>
          <SelectItem value="desc">{t("descending")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}