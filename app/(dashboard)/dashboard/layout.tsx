export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { canAccess, isAdmin, type Role } from "@/lib/permissions"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/admin/nav"
import { DashboardSearch } from "@/components/admin/dashboard-search"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import { NotificationBell } from "@/components/admin/notification-bell"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  const role = user.role as Role | undefined
  if (!role || (role !== "ADMIN" && role !== "EDITOR")) {
    redirect("/profile")
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <div className="flex items-center gap-3">
            <DashboardSearch />
            <NotificationBell />
            <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
            />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav
            items={dashboardConfig.sidebarNav.filter((item) =>
              canAccess((user.role ?? "CONTRIBUTOR") as Role, item.href)
            )}
          />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
