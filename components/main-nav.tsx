"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function MainNav({ items, children }: MainNavProps) {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  // Close menu on route change
  React.useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  return (
    <div className="flex items-center gap-6 md:gap-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold shrink-0">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden sm:inline-block text-base">{siteConfig.name}</span>
      </Link>

      {/* Desktop nav */}
      {items?.length ? (
        <nav className="hidden md:flex items-center gap-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                isActive(item.href, pathname)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                item.disabled && "cursor-not-allowed opacity-50 pointer-events-none"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}

      {/* Mobile hamburger */}
      <button
        type="button"
        className="flex md:hidden items-center justify-center h-9 w-9 rounded-md border bg-background hover:bg-muted transition-colors"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
        aria-expanded={showMobileMenu}
      >
        {showMobileMenu ? (
          <Icons.close className="h-4 w-4" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        )}
      </button>

      {showMobileMenu && items && (
        <MobileNav items={items} onClose={() => setShowMobileMenu(false)}>
          {children}
        </MobileNav>
      )}
    </div>
  )
}
