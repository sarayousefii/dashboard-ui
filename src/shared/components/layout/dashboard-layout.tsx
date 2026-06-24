import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

interface Props {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}