"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("language");

  const nextLocale = locale === "en" ? "fa" : "en";
  const queryString = searchParams.toString();

  const label =
    locale === "en"
      ? "فارسی"
      : "English";

  const ariaLabel =
    locale === "en"
      ? t("switchToPersian")
      : t("switchToEnglish");

  function handleLanguageChange() {
    const href = queryString
      ? `${pathname}?${queryString}`
      : pathname;

    router.replace(href, {
      locale: nextLocale,
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLanguageChange}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {label}
    </Button>
  );
}