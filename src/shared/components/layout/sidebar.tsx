"use client";

import { useTranslations } from "next-intl";

import { navigation } from "@/config/navigation";
import { usePermission } from "@/features/auth/hooks/use-permission";
import { Link, usePathname } from "@/i18n/navigation";
import { hasPermission } from "@/shared/lib/permissions";
import { useUIStore } from "@/store/ui-store";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const brandT = useTranslations("brand");

  const isSidebarOpen = useUIStore(
    (state) => state.isSidebarOpen,
  );

  const { role } = usePermission();

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <aside className="hidden w-64 flex-col border-s bg-background md:flex">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">Dashboard UI</h2>

        <p className="text-sm text-muted-foreground">
          {brandT("adminPanel")}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navigation.map((item) => {
          const canAccess = hasPermission(
            role,
            item.permission,
          );

          if (!canAccess) {
            return null;
          }

          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-4 py-3
                transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}