"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LazyMotion, domAnimation, m } from "framer-motion"

import { MainNavItem } from "types"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Icons } from "@/components/icons"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  onClose?: () => void
  logoUrl?: string
  siteName?: string
}

export function MobileNav({ items, children, onClose, logoUrl, siteName }: MobileNavProps) {
  useLockBody()
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <LazyMotion features={domAnimation}>
      {/* Backdrop */}
      <div
        className="md:hidden"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 40, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden
      />

      {/* Sidebar trái */}
      <m.div
        className="fixed left-0 top-0 h-screen z-50 md:hidden w-72 bg-background shadow-2xl flex flex-col"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header sidebar */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2.5">
            {logoUrl && <img src={logoUrl} alt={siteName ?? "Logo"} className="h-10 w-auto object-contain" />}
            {siteName && <span className="font-heading font-semibold text-sm">{siteName}</span>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Đóng menu"
          >
            <Icons.close className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors border-l-[3px]",
                isActive(item.href)
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "cursor-not-allowed opacity-50 pointer-events-none"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {children && <div className="border-t p-4">{children}</div>}
      </m.div>
    </LazyMotion>
  )
}
