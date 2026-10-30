import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("products.states");

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        {t("notFoundTitle")}
      </h1>

      <p className="text-muted-foreground">
        {t("notFoundDescription")}
      </p>

      <Link
        href="/products"
        className="inline-block rounded-lg border px-4 py-2"
      >
        {t("backToProducts")}
      </Link>
    </div>
  );
}