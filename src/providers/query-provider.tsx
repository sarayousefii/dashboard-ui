"use client";

import { useState } from "react";

import {
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "@/shared/lib/react-query";

interface Props {
  children: React.ReactNode;
  state?: null | undefined;
}

export function QueryProvider({ children, state }: Props) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={state}>
        {children}
      </HydrationBoundary>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}