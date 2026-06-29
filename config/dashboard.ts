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
      title: "Dashboard",
      href: "/dashboard",
      icon: "billing",
    },
    {
      title: "Bài viết",
      href: "/dashboard/posts",
      icon: "post",
    },
    {
      title: "Lên lịch",
      href: "/dashboard/scheduled",
      icon: "clock",
    },
    {
      title: "Danh mục",
      href: "/dashboard/categories",
      icon: "page",
    },
    {
      title: "Trang tĩnh",
      href: "/dashboard/pages",
      icon: "page",
    },
    {
      title: "Menu",
      href: "/dashboard/menu",
      icon: "page",
    },
    {
      title: "Bình luận",
      href: "/dashboard/comments",
      icon: "page",
    },
    {
      title: "Người dùng",
      href: "/dashboard/users",
      icon: "user",
    },
    {
      title: "Về chúng tôi",
      href: "/dashboard/about",
      icon: "page",
    },
    {
      title: "Liên hệ",
      href: "/dashboard/lien-he",
      icon: "page",
    },
    {
      title: "Giao diện",
      href: "/dashboard/giao-dien",
      icon: "settings",
    },
    {
      title: "Cài đặt",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
