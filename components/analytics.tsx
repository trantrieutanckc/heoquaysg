"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      ;(window as any).gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}
