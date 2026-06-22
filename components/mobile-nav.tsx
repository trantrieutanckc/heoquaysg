"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Icons } from "@/components/icons"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  onClose?: () => void
}

export function MobileNav({ items, children, onClose }: MobileNavProps) {
  useLockBody()
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div className="fixed left-0 right-0 top-16 z-50 md:hidden animate-in slide-in-from-top-2 duration-200">
        <div className="container px-4 sm:px-6 pt-2 pb-4">
          <div className="rounded-xl border bg-background shadow-lg overflow-hidden">
            {/* Logo row */}
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <Icons.logo className="h-5 w-5" />
              <span className="font-bold text-sm">{siteConfig.name}</span>
            </div>

            {/* Nav links */}
            <nav className="p-2">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    item.disabled && "cursor-not-allowed opacity-50 pointer-events-none"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {children && <div className="border-t p-3">{children}</div>}
          </div>
        </div>
      </div>
    </>
  )
}
