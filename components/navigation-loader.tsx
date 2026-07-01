"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { FunnyLoader } from "@/components/funny-loader"

function Overlay() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setVisible(false), 400)
    return () => clearTimeout(t)
  }, [pathname, searchParams])

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href") ?? ""
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return
      if (anchor.target === "_blank") return
      if (href.startsWith("http://") || href.startsWith("https://")) return
      setVisible(true)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <FunnyLoader />
    </div>
  )
}

export function NavigationLoader() {
  return (
    <React.Suspense>
      <Overlay />
    </React.Suspense>
  )
}
