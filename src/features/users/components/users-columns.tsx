import type { ColumnDef } from "@tanstack/react-table";

import type { User } from "../types/user.types";
import { UserActions } from "./user-actions";

type UserColumnTranslationKey =
  | "table.firstName"
  | "table.lastName"
  | "table.email"
  | "table.age"
  | "table.role"
  | "table.status"
  | "roles.admin"
  | "roles.editor"
  | "roles.viewer"
  | "statuses.active"
  | "statuses.inactive"
  | "statuses.pending";

export function createUserColumns(
  t: (key: UserColumnTranslationKey) => string,
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "firstName",
      header: t("table.firstName"),
    },
    {
      accessorKey: "lastName",
      header: t("table.lastName"),
    },
    {
      accessorKey: "email",
      header: t("table.email"),
    },
    {
      accessorKey: "age",
      header: t("table.age"),
    },
    {
      accessorKey: "role",
      header: t("table.role"),
      cell: ({ row }) => (
        <span>
          {t(`roles.${row.original.role ?? "viewer"}`)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      cell: ({ row }) => (
        <span>
          {t(`statuses.${row.original.status ?? "active"}`)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <UserActions user={row.original} />
      ),
    },
  ];
}