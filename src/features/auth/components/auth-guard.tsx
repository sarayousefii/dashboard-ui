"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

import { useCurrentUser } from "../hooks/use-current-user";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const { data, isLoading } = useCurrentUser();
  const isAuthPage = pathname === "/login";

  useEffect(() => {
    if (isLoading) return;

    if (!data?.user && !isAuthPage) {
      router.replace("/login");
      return;
    }

    if (data?.user && isAuthPage) {
      router.replace("/products");
    }
  }, [data?.user, isAuthPage, isLoading, router]);

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return <>{children}</>;
}