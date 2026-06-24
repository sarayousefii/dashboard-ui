"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "../hooks/use-current-user";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useCurrentUser();

  const isAuthPage = pathname === "/login";

  useEffect(() => {
    if (isLoading) return;

    if (!data?.user && !isAuthPage) {
        router.replace("/login");
    }

    if (data?.user && isAuthPage) {
        router.replace("/products");
    }
    }, [data, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}