"use client";

import Link from "next/link";
import { useState } from "react";

import {
  MoreHorizontal,
  Trash2,
  Power,
  Shield,
  UserCog,
  Eye,
  Pencil,
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

import { User, UserRole } from "../types/user.types";

import { usePermission } from "@/features/auth/hooks/use-permission";

interface Props {
  user: User;
}

export function UserActions({
  user,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const {
    mutate: deleteUser,
    isPending: isDeleting,
  } = useDeleteUser();

  const {
    mutate: toggleStatus,
  } = useToggleUserStatus();

  const {
    mutate: updateRole,
  } = useUpdateUserRole();

  const {
    canDeleteUser,
    canChangeRole,
    canEditUser,
  } = usePermission();

  const nextStatus =
    user.status === "active"
      ? "inactive"
      : "active";

  const handleDelete = () => {
    deleteUser(user.id, {
      onSuccess: () =>
        setOpen(false),
    });
  };

  return (
    <>
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <Button
              variant="ghost"
              size="icon"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48"
          >
            <DropdownMenuItem
              asChild
            >
              <Link
                href={`/users/${user.id}`}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>

            {canEditUser && (
              <DropdownMenuItem
                asChild
              >
                <Link
                  href={`/users/edit/${user.id}`}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
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
                  <Shield className="mr-2 h-4 w-4" />
                  Make Admin
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    updateRole({
                      id: user.id,
                      role: "editor" as UserRole,
                    })
                  }
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Make Editor
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    updateRole({
                      id: user.id,
                      role: "viewer" as UserRole,
                    })
                  }
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Make Viewer
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
                <Power className="mr-2 h-4 w-4" />

                {user.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </DropdownMenuItem>
            )}

            {canDeleteUser && (
              <DropdownMenuItem
                onClick={() =>
                  setOpen(true)
                }
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${user.firstName}?`}
        confirmText="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}