"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function FooterNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  if (isActive) {
    return <span className="text-stone-100 cursor-default">{label}</span>
  }

  return (
    <Link
      href={href}
      className="relative hover:text-stone-100 transition-colors after:absolute after:-bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:w-0 after:transition-[width] after:duration-500 hover:after:w-full"
    >
      {label}
    </Link>
  )
}
