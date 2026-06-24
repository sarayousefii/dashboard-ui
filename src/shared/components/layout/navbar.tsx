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

import {
  Menu,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const { data, isLoading } =
    useCurrentUser();

  const { mutate: logout } =
    useLogout();

  const toggleSidebar =
    useUIStore(
      (state) =>
        state.toggleSidebar
    );

  if (isLoading) {
    return (
      <header className="flex h-16 items-center justify-between border-b px-6">
        Loading...
      </header>
    );
  }

  const user = data?.user;

  return (
    <header
      className="
        flex
        h-16
        items-center
        justify-between
        border-b
        bg-background
        px-6
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div>
          <h2 className="text-sm font-semibold">
            Hello, {user?.name}
          </h2>

          <p className="text-xs text-muted-foreground">
            Welcome back
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div
          className="
            rounded-full
            bg-muted
            px-3
            py-1
            text-xs
            font-medium
            uppercase
          "
        >
          {user?.role}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-primary
                text-sm
                font-semibold
                text-primary-foreground
                transition-opacity
                hover:opacity-90
              "
            >
              {user?.name?.charAt(0)}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <div className="border-b px-3 py-2">
              <p className="font-medium">
                {user?.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {user?.role}
              </p>
            </div>

            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}