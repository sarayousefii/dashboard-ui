import { useCurrentUser } from "./use-current-user";
import { hasPermission } from "@/shared/lib/permissions";

export function usePermission() {
  const { data } = useCurrentUser();

  const role = data?.user?.role;

  return {
    role,

    canCreateUser: hasPermission(role, "users.create"),
    canEditUser: hasPermission(role, "users.edit"),
    canDeleteUser: hasPermission(role, "users.delete"),
    canChangeRole: hasPermission(role, "users.changeRole"),
  };
}