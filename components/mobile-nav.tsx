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
        className="xl:hidden"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 40, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden
      />

      {/* Sidebar trái */}
      <m.div
        className="fixed left-0 top-0 h-screen z-50 xl:hidden w-72 bg-background shadow-2xl flex flex-col"
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

        <div className="border-t p-4 flex flex-col gap-2">
          <Link
            href="/dat-lich"
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Đặt lịch
          </Link>
          {children && <div>{children}</div>}
        </div>
      </m.div>
    </LazyMotion>
  )
}
