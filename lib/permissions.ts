export type Role = "ADMIN" | "EDITOR" | "CONTRIBUTOR"

// Các trang mỗi role được phép truy cập
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["/dashboard", "/dashboard/categories", "/dashboard/pages", "/dashboard/menu", "/dashboard/comments", "/dashboard/users", "/dashboard/billing", "/dashboard/settings", "/dashboard/about", "/dashboard/lien-he", "/dashboard/giao-dien"],
  EDITOR: ["/dashboard", "/dashboard/categories", "/dashboard/menu", "/dashboard/comments", "/dashboard/dat-lich", "/dashboard/about", "/dashboard/lien-he"],
  CONTRIBUTOR: [],
}

export function canAccess(role: Role, path: string): boolean {
  return ROLE_PERMISSIONS[role]?.some((p) => path === p || path.startsWith(p + "/")) ?? false
}

export function isAdmin(role: Role) { return role === "ADMIN" }
export function isEditor(role: Role) { return role === "ADMIN" || role === "EDITOR" }
