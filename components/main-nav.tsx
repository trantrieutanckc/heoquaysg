"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { MainNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
  logoUrl?: string
  siteName?: string
  centered?: boolean
}

const MAX_VISIBLE = 5

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function MainNav({ items, children, logoUrl, siteName, centered }: MainNavProps) {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)
  const [showMore, setShowMore] = React.useState(false)
  const moreRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  // Close "more" dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const visibleItems = items?.slice(0, MAX_VISIBLE) ?? []
  const overflowItems = items?.slice(MAX_VISIBLE) ?? []
  const hasOverflow = overflowItems.length > 0

  return (
    <div className="flex items-center gap-4 md:gap-6">
      {/* Logo + site name */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={siteName ?? "Logo"}
            className="h-9 w-9 object-cover"
          />
        ) : (
          <div className="h-9 w-9 bg-primary/10 flex items-center justify-center text-primary font-bold text-sm select-none border border-primary/20">
            {(siteName ?? "H")[0]}
          </div>
        )}
        {siteName && (
          <span className="font-heading font-semibold text-sm leading-none hidden sm:block italic">
            {siteName}
          </span>
        )}
      </Link>

      {/* Desktop nav */}
      {items?.length ? (
        <nav className={cn(
          "hidden md:flex items-center gap-1",
          centered && "absolute left-1/2 -translate-x-1/2"
        )}>
          {visibleItems.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                isActive(item.href, pathname)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/90 hover:text-primary-foreground",
                item.disabled && "cursor-not-allowed opacity-50 pointer-events-none"
              )}
            >
              {item.title}
            </Link>
          ))}

          {/* Overflow dropdown */}
          {hasOverflow && (
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                  overflowItems.some((i) => isActive(i.href, pathname))
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                Xem thêm
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={cn("transition-transform duration-200", showMore && "rotate-180")}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {showMore && (
                <div className="absolute left-0 top-full mt-1.5 w-44 border bg-background shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                  {overflowItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.disabled ? "#" : item.href}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex items-center px-4 py-2.5 text-sm transition-colors border-l-2",
                        isActive(item.href, pathname)
                          ? "border-primary bg-muted text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                        item.disabled && "cursor-not-allowed opacity-50 pointer-events-none"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      ) : null}

      {/* Mobile hamburger */}
      <button
        type="button"
        className="flex md:hidden items-center justify-center h-9 w-9 border bg-background hover:bg-muted transition-colors"
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
        <MobileNav items={items} logoUrl={logoUrl} siteName={siteName} onClose={() => setShowMobileMenu(false)}>
          {children}
        </MobileNav>
      )}
    </div>
  )
}
