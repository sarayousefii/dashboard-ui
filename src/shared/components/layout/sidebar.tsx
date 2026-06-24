"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/config/navigation";

import { useUIStore } from "@/store/ui-store";

import { usePermission } from "@/features/auth/hooks/use-permission";

import { hasPermission } from "@/shared/lib/permissions";

export function Sidebar() {
  const pathname = usePathname();

  const isSidebarOpen = useUIStore(
    (state) => state.isSidebarOpen
  );

  const { role } = usePermission();

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <aside
      className="
        hidden
        md:flex
        w-64
        flex-col
        border-r
        bg-background
      "
    >
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">
          Dashboard UI
        </h2>

        <p className="text-sm text-muted-foreground">
          Admin Panel
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navigation.map((item) => {
          const canAccess = hasPermission(
            role,
            item.permission
          );

          if (!canAccess) {
            return null;
          }

          const Icon = item.icon;

          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
              `}
            >
              <Icon className="h-4 w-4" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}