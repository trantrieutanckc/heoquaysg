export const dynamic = "force-dynamic"

import Link from "next/link"

import { db } from "@/lib/db"
import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { SearchButton } from "@/components/search-button"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  let dbMenuItems: { title: string; href: string; disabled?: boolean }[] = []
  let categories: { name: string; slug: string }[] = []
  try {
    const [menus, cats] = await Promise.all([
      db.menuItem.findMany({ where: { disabled: false }, orderBy: { order: "asc" } }),
      db.category.findMany({ orderBy: { order: "asc" } }),
    ])
    dbMenuItems = menus
    categories = cats
  } catch {
    // DB unreachable — fallback to static nav
  }

  const navItems = dbMenuItems.length
    ? dbMenuItems.map((item) => ({ title: item.title, href: item.href }))
    : categories.length
    ? categories.map((cat) => ({ title: cat.name, href: `/categories/${cat.slug}` }))
    : marketingConfig.mainNav

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={navItems} />
          <nav className="flex items-center gap-2">
            <SearchButton />
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
