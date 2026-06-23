export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/session"
import { UserAccountNav } from "@/components/user-account-nav"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://heoquaysg.com/wp-content/uploads/2022/08/cropped-heo-quay-47.jpg"
              alt="Heo Quay SG"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-heading font-bold text-sm hidden sm:block">Heo Quay SG</span>
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserAccountNav user={{ name: user.name, image: user.image, email: user.email }} />
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 sm:px-6 py-10">{children}</main>
    </div>
  )
}
