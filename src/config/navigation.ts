import {
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";

export const navigation = [
  {
    labelKey: "dashboard",
    href: "/",
    icon: LayoutDashboard,
    permission: "dashboard.view",
  },
  {
    labelKey: "products",
    href: "/products",
    icon: Package,
    permission: "products.view",
  },
  {
    labelKey: "users",
    href: "/users",
    icon: Users,
    permission: "users.view",
  },
] as const;