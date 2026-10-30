import { DashboardPageView } from "@/features/dashboard/components/dashboard-page-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};
export default function HomePage() {
  return <DashboardPageView />;
}