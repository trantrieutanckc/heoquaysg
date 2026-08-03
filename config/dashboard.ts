import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "laptop",
    },
    {
      title: "Tài liệu",
      href: "/dashboard/docs",
      icon: "docs",
    },
    {
      title: "Bài viết",
      href: "/dashboard/posts",
      icon: "post",
    },
    {
      title: "Bài theo lịch",
      href: "/dashboard/scheduled",
      icon: "clock",
    },
    {
      title: "Thông báo",
      href: "/dashboard/notifications",
      icon: "bell",
    },
    {
      title: "Đặt lịch",
      href: "/dashboard/dat-lich",
      icon: "calendar",
    },
    {
      title: "Danh mục",
      href: "/dashboard/categories",
      icon: "category",
    },
    {
      title: "Tags",
      href: "/dashboard/tags",
      icon: "tag",
    },
    {
      title: "Thực đơn",
      href: "/dashboard/thuc-don",
      icon: "menu",
    },
    {
      title: "Trang tĩnh",
      href: "/dashboard/pages",
      icon: "staticPage",
    },
    {
      title: "Menu",
      href: "/dashboard/menu",
      icon: "navMenu",
    },
    {
      title: "Bình luận",
      href: "/dashboard/comments",
      icon: "comment",
    },
    {
      title: "Subscribers",
      href: "/dashboard/subscribers",
      icon: "users",
    },
    {
      title: "Người dùng",
      href: "/dashboard/users",
      icon: "user",
    },
    {
      title: "Về chúng tôi",
      href: "/dashboard/about",
      icon: "about",
    },
    {
      title: "Liên hệ",
      href: "/dashboard/lien-he",
      icon: "contact",
    },
    {
      title: "Giao diện",
      href: "/dashboard/giao-dien",
      icon: "palette",
    },
    {
      title: "Import / Export",
      href: "/dashboard/import-export",
      icon: "importExport",
    },
    {
      title: "Cài đặt",
      href: "/dashboard/settings",
      icon: "settings",
    },
    {
      title: "Chặn IP",
      href: "/dashboard/ip-block",
      icon: "ipBlock",
      adminOnly: true,
    },
  ],
}
