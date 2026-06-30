export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/session"
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { type Role } from "@/lib/permissions"

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const role = (user as any).role as Role | undefined
  const canAccessDashboard = role === "ADMIN" || role === "EDITOR"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo-v4.svg"
              alt="Heo Quay Bình Tân"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-heading font-bold text-sm hidden sm:block">Heo Quay Bình Tân</span>
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
      <main className="flex-1 container px-4 sm:px-6 py-10">{children}</main>
    </div>
  )
}
