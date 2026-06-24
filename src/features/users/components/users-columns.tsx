import { ColumnDef } from "@tanstack/react-table";
import { User } from "../types/user.types";
import { UserActions } from "./user-actions";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "role",

    header: "Role",

    cell: ({ row }) => {
      return (
        <span>
          {row.original.role ??
            "viewer"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status =
        row.original.status ?? "active";

      return (
        <span>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original; // ✅ fully typed now

      return (
        <UserActions user={row.original} />
      );
    },
  },
];