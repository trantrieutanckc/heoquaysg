export const dynamic = "force-dynamic"

import Link from "next/link"

import { db } from "@/lib/db"
import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { SearchButton } from "@/components/search-button"
import { getCurrentUser } from "@/lib/session"
import { UserAccountNav } from "@/components/user-account-nav"
import { Phone } from "lucide-react"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  let dbMenuItems: { title: string; href: string; disabled?: boolean }[] = []
  let categories: { name: string; slug: string }[] = []
  const user = await getCurrentUser()
  let cfg: Record<string, string> = {}

  try {
    const [menus, cats, siteConfigRow] = await Promise.all([
      db.menuItem.findMany({ where: { disabled: false }, orderBy: { order: "asc" } }),
      db.category.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      db.siteConfig.findUnique({ where: { id: "default" } }),
    ])
    dbMenuItems = menus
    categories = cats
    cfg = (siteConfigRow?.data ?? {}) as Record<string, string>
  } catch {
    // DB unreachable — fallback to static nav
  }

  const navItems = dbMenuItems.length
    ? dbMenuItems.map((item) => ({ title: item.title, href: item.href }))
    : categories.length
    ? categories.map((cat) => ({ title: cat.name, href: `/categories/${cat.slug}` }))
    : marketingConfig.mainNav

  const contactPhone = cfg.contactPhone?.trim()
  const contactZalo = cfg.contactZalo?.trim()
  const socialFacebook = cfg.socialFacebook?.trim()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <MainNav items={navItems} />
          <nav className="flex items-center gap-1.5">

            {/* Contact icons */}
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                title={`Gọi: ${contactPhone}`}
                className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="sr-only">Gọi điện</span>
              </a>
            )}

            {contactZalo && (
              <a
                href={`https://zalo.me/${contactZalo.replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Zalo: ${contactZalo}`}
                className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-1.25v-4h1.25v4zm-2.75 0H12.5V10h1.25v5.5zm-2.75 0H9.75v-2.75H8.5V10h1.25v2.75h.25v2.75zm-2.75-5.5H7v5.5H5.75v-5.5z"/>
                </svg>
                <span className="sr-only">Zalo</span>
              </a>
            )}

            {socialFacebook && (
              <a
                href={socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
            )}

            <SearchButton />
            {user ? (
              <UserAccountNav
                user={{ name: user.name, image: user.image, email: user.email }}
                role={(user as any).role}
              />
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "px-4 rounded-full ml-1")}
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
