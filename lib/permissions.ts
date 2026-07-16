export type Role = "ADMIN" | "EDITOR" | "CONTRIBUTOR"

// Các trang mỗi role được phép truy cập
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "/dashboard",
    "/dashboard/posts",
    "/dashboard/scheduled",
    "/dashboard/notifications",
    "/dashboard/dat-lich",
    "/dashboard/categories",
    "/dashboard/tags",
    "/dashboard/thuc-don",
    "/dashboard/pages",
    "/dashboard/menu",
    "/dashboard/comments",
    "/dashboard/subscribers",
    "/dashboard/users",
    "/dashboard/billing",
    "/dashboard/about",
    "/dashboard/lien-he",
    "/dashboard/giao-dien",
    "/dashboard/docs",
    "/dashboard/settings",
  ],
  EDITOR: [
    "/dashboard",
    "/dashboard/posts",
    "/dashboard/scheduled",
    "/dashboard/notifications",
    "/dashboard/dat-lich",
    "/dashboard/categories",
    "/dashboard/tags",
    "/dashboard/thuc-don",
    "/dashboard/menu",
    "/dashboard/comments",
    "/dashboard/subscribers",
    "/dashboard/about",
    "/dashboard/lien-he",
  ],
  CONTRIBUTOR: [],
}

export function canAccess(role: Role, path: string): boolean {
  return ROLE_PERMISSIONS[role]?.some((p) => path === p || path.startsWith(p + "/")) ?? false
}

export function isAdmin(role: Role) { return role === "ADMIN" }
export function isEditor(role: Role) { return role === "ADMIN" || role === "EDITOR" }
