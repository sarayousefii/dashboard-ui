import {
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    permission: "dashboard.view",
  },

  {
    label: "Products",
    href: "/products",
    icon: Package,
    permission: "products.view",
  },

  {
    label: "Users",
    href: "/users",
    icon: Users,
    permission: "users.view",
  },
];