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
  const contactEmail = cfg.contactEmail?.trim()
  const contactAddress = cfg.contactAddress?.trim()
  const contactZalo = cfg.contactZalo?.trim()
  const socialFacebook = cfg.socialFacebook?.trim()
  const socialInstagram = cfg.socialInstagram?.trim()
  const socialYoutube = cfg.socialYoutube?.trim()

  const hasTopBar = contactPhone || contactEmail || contactAddress || socialFacebook || socialInstagram || socialYoutube || contactZalo

  return (
    <div className="flex min-h-screen flex-col">

      {/* ── Top bar ─────────────────────────────────────────── */}
      {hasTopBar && (
        <div className="w-full border-b bg-muted/60 text-xs hidden sm:block">
          <div className="container flex h-9 items-center justify-between px-4 sm:px-6 gap-4">

            {/* Left — contact info */}
            <ul className="flex items-center gap-4 text-muted-foreground">
              {contactPhone && (
                <li>
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                    {contactPhone}
                  </a>
                </li>
              )}
              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                    </svg>
                    {contactEmail}
                  </a>
                </li>
              )}
              {contactAddress && (
                <li>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                    </svg>
                    {contactAddress}
                  </a>
                </li>
              )}
            </ul>

            {/* Right — social icons */}
            <ul className="flex items-center gap-3 text-muted-foreground">
              {contactZalo && (
                <li>
                  <a href={`https://zalo.me/${contactZalo.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" title="Zalo" className="hover:text-blue-500 transition-colors">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-1.25v-4h1.25v4zm-2.75 0H12.5V10h1.25v5.5zm-2.75 0H9.75v-2.75H8.5V10h1.25v2.75h.25v2.75zm-2.75-5.5H7v5.5H5.75v-5.5z"/>
                    </svg>
                    <span className="sr-only">Zalo</span>
                  </a>
                </li>
              )}
              {socialFacebook && (
                <li>
                  <a href={socialFacebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:text-blue-600 transition-colors">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </a>
                </li>
              )}
              {socialInstagram && (
                <li>
                  <a href={socialInstagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:text-pink-500 transition-colors">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </a>
                </li>
              )}
              {socialYoutube && (
                <li>
                  <a href={socialYoutube} target="_blank" rel="noopener noreferrer" title="YouTube" className="hover:text-red-600 transition-colors">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="sr-only">YouTube</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ── Main header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container relative flex h-20 items-center justify-between px-4 sm:px-6">
          <MainNav items={navItems} logoUrl={cfg.logoUrl?.trim()} siteName={cfg.siteName?.trim()} centered />
          <nav className="flex items-center gap-1.5">
            <SearchButton />
            <Link
              href="/dat-lich"
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Đặt lịch
            </Link>
            {user ? (
              <UserAccountNav
                user={{ name: user.name, image: user.image, email: user.email }}
                role={user.role}
              />
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "px-4 ml-1 rounded-none text-xs uppercase tracking-wider font-bold")}
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>

<SiteFooter
        siteName={cfg.siteName?.trim()}
        logoUrl={cfg.logoUrl?.trim()}
        siteDescription={cfg.siteDescription?.trim()}
        contactPhone={cfg.contactPhone?.trim()}
        contactEmail={cfg.contactEmail?.trim()}
        contactAddress={cfg.contactAddress?.trim()}
        businessHours={cfg.businessHours?.trim()}
        socialFacebook={cfg.socialFacebook?.trim()}
        socialInstagram={cfg.socialInstagram?.trim()}
        socialYoutube={cfg.socialYoutube?.trim()}
        contactZalo={cfg.contactZalo?.trim()}
      />
    </div>
  )
}
