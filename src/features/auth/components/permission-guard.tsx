"use client";

import { ReactNode } from "react";

import { usePermission } from "../hooks/use-permission";

import { hasPermission } from "@/shared/lib/permissions";

interface Props {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: Props) {
  const { role } = usePermission();

  const canAccess = hasPermission(
    role,
    permission
  );

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}