import type { ReactNode } from 'react';

import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-svh w-full min-w-0 overflow-hidden bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          <div className="mx-auto min-h-full w-full min-w-0 max-w-[1680px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
