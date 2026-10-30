import type { ReactNode } from "react";

import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="min-h-0 flex-1 overflow-y-auto bg-background p-6 text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}