export type Role = "ADMIN" | "EDITOR" | "CONTRIBUTOR"

// Các trang mỗi role được phép truy cập
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["/dashboard", "/dashboard/categories", "/dashboard/menu", "/dashboard/comments", "/dashboard/users", "/dashboard/billing", "/dashboard/settings"],
  EDITOR: ["/dashboard", "/dashboard/categories", "/dashboard/menu"],
  CONTRIBUTOR: [],
}

export function canAccess(role: Role, path: string): boolean {
  return ROLE_PERMISSIONS[role]?.some((p) => path === p || path.startsWith(p + "/")) ?? false
}

export function isAdmin(role: Role) { return role === "ADMIN" }
export function isEditor(role: Role) { return role === "ADMIN" || role === "EDITOR" }
