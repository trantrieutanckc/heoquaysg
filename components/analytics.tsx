"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track pageview khi navigate
  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    window.gtag?.("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  // Track click vào số điện thoại
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a")
      if (!a?.href?.startsWith("tel:")) return

      // Google Ads
      window.gtag?.("event", "conversion", {
        event_category: "contact",
        event_label: "click_to_call",
      })

      // Facebook Pixel
      window.fbq?.("track", "Contact")
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return null
}
