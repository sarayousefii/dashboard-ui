"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}