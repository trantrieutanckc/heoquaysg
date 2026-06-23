import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/dashboard/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Posts",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: "page",
    },
    {
      title: "Menu",
      href: "/dashboard/menu",
      icon: "page",
    },
    {
      title: "Comments",
      href: "/dashboard/comments",
      icon: "page",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "user",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
