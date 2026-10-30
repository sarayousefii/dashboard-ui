"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("theme");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const label = !mounted
    ? t("label")
    : isDark
      ? t("switchToLight")
      : t("switchToDark");

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={!mounted}
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label={label}
      title={label}
    >
      {mounted && isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}