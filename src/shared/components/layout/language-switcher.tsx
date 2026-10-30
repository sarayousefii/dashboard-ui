
"use client";

import { GB, IR } from "country-flag-icons/react/3x2";
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
  const Flag = locale === "en" ? IR : GB;

  const ariaLabel =
    locale === "en"
      ? t("switchToPersian")
      : t("switchToEnglish");

  function handleLanguageChange() {
    const queryString = searchParams.toString();

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
      variant="ghost"
      size="icon"
      className="h-9 w-9 shrink-0 rounded-full p-0"
      onClick={handleLanguageChange}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Flag
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        className="h-9 w-9 rounded-full"
      />
    </Button>
  );
}
