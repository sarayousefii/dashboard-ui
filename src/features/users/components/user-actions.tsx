
"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import {
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
  Shield,
  Trash2,
  UserCog,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmDialog } from "@/shared/components/common/confirm-dialog";

import { useDeleteUser } from "../hooks/use-delete-user";
import { useToggleUserStatus } from "../hooks/use-toggle-user-status";
import { useUpdateUserRole } from "../hooks/use-update-user-role";

import type { User, UserRole } from "../types/user.types";

import { usePermission } from "@/features/auth/hooks/use-permission";

interface Props {
  user: User;
}

export function UserActions({ user }: Props) {
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";

  const t = useTranslations("users.actions");

  const {
    mutate: deleteUser,
    isPending: isDeleting,
  } = useDeleteUser();

  const { mutate: toggleStatus } = useToggleUserStatus();
  const { mutate: updateRole } = useUpdateUserRole();

  const {
    canDeleteUser,
    canChangeRole,
    canEditUser,
  } = usePermission();

  const currentStatus = user.status ?? "active";

  const nextStatus =
    currentStatus === "active" ? "inactive" : "active";

  const handleDelete = () => {
    deleteUser(user.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <>
      <div className="flex justify-center">
        <DropdownMenu dir={direction}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("open")}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            style={{ direction }}
            className="w-48"
          >
            <DropdownMenuItem asChild>
              <Link
                href={`/users/${user.id}`}
                className="flex w-full items-center"
              >
                <Eye className="me-2 h-4 w-4 shrink-0" />
                <span>{t("view")}</span>
              </Link>
            </DropdownMenuItem>

            {canEditUser && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/users/edit/${user.id}`}
                  className="flex w-full items-center"
                >
                  <Pencil className="me-2 h-4 w-4 shrink-0" />
                  <span>{t("edit")}</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {canChangeRole && (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    updateRole({
                      id: user.id,
                      role: "admin" as UserRole,
                    })
                  }
                >
                  <Shield className="me-2 h-4 w-4 shrink-0" />
                  <span>{t("makeAdmin")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    updateRole({
                      id: user.id,
                      role: "editor" as UserRole,
                    })
                  }
                >
                  <UserCog className="me-2 h-4 w-4 shrink-0" />
                  <span>{t("makeEditor")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    updateRole({
                      id: user.id,
                      role: "viewer" as UserRole,
                    })
                  }
                >
                  <UserCog className="me-2 h-4 w-4 shrink-0" />
                  <span>{t("makeViewer")}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>
            )}

            {canEditUser && (
              <DropdownMenuItem
                onClick={() =>
                  toggleStatus({
                    id: user.id,
                    status: nextStatus,
                  })
                }
              >
                <Power className="me-2 h-4 w-4 shrink-0" />
                <span>
                  {currentStatus === "active"
                    ? t("deactivate")
                    : t("activate")}
                </span>
              </DropdownMenuItem>
            )}

            {canDeleteUser && (
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="text-destructive"
              >
                <Trash2 className="me-2 h-4 w-4 shrink-0" />
                <span>{t("delete")}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("deleteTitle")}
        description={t("deleteDescription", {
          name: user.firstName,
        })}
        confirmText={t("confirmDelete")}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
