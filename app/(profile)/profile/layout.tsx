export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { type Role } from "@/lib/permissions"

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [user, cfgRow] = await Promise.all([
    getCurrentUser(),
    db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null),
  ])
  const cfg = (cfgRow?.data ?? {}) as Record<string, string>
  const logoUrl = cfg.logoUrl?.trim() || "/images/logo-new.svg"
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"

  if (!user) redirect("/login")

  const role = user.role as Role | undefined
  const canAccessDashboard = role === "ADMIN" || role === "EDITOR"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={logoUrl}
              alt={siteName}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-heading font-bold text-sm hidden sm:block">{siteName}</span>
          </Link>
          <div className="flex items-center gap-2">
            {canAccessDashboard && (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                <Icons.chevronLeft className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            <ModeToggle />
            <UserAccountNav user={{ name: user.name, image: user.image, email: user.email }} />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-br from-orange-50/50 via-white to-rose-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container px-4 sm:px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
