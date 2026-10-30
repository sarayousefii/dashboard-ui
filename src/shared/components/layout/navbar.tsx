
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useUIStore } from "@/store/ui-store";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

import { LogOut, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

export function Navbar() {
  const { data, isLoading } = useCurrentUser();
  const { mutate: logout } = useLogout();

  const t = useTranslations("navbar");

  const toggleSidebar = useUIStore(
    (state) => state.toggleSidebar,
  );

  if (isLoading) {
    return (
      <header className="flex h-16 items-center justify-between border-b px-6">
        {t("loading")}
      </header>
    );
  }

  const user = data?.user;

  return (
    <header
      className="
        flex h-16 items-center justify-between
        border-b bg-background px-6
      "
    >
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          aria-label={t("toggleSidebar")}
          title={t("toggleSidebar")}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div>
          <h2 className="text-sm font-semibold">
            {t("hello", { name: user?.name ?? "" })}
          </h2>

          <p className="text-xs text-muted-foreground">
            {t("welcomeBack")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        
        <div
          className="
            rounded-full bg-muted px-3 py-1
            text-xs font-medium uppercase
          "
        >
          {user?.role}
        </div>
        
        <LanguageSwitcher />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={user?.name ?? "User menu"}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full bg-primary text-sm font-semibold
                text-primary-foreground transition-opacity
                hover:opacity-90
              "
            >
              {user?.name?.charAt(0)}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="border-b px-3 py-2">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role}
              </p>
            </div>

            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer"
            >
              <LogOut className="me-2 h-4 w-4" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
