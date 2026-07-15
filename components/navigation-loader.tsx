"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { FunnyLoader } from "@/components/funny-loader"

function Overlay() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = React.useState(false)

  // Tắt loader khi browser idle sau khi pathname đổi (page đã render + paint xong)
  React.useEffect(() => {
    if (!visible) return
    let id: number
    let fallback: ReturnType<typeof setTimeout>
    const hide = () => {
      fallback = setTimeout(() => setVisible(false), 150)
    }
    if (typeof requestIdleCallback !== "undefined") {
      id = requestIdleCallback(hide, { timeout: 3000 })
    } else {
      // Safari fallback: đợi 2 animation frame (đảm bảo đã paint)
      requestAnimationFrame(() => requestAnimationFrame(hide))
    }
    return () => {
      if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(id)
      clearTimeout(fallback)
    }
  }, [pathname, searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (visible) {
      const scrollY = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      const top = document.body.style.top
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, parseInt(top || "0") * -1)
    }
    return () => {
      const top = document.body.style.top
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      if (top) window.scrollTo(0, parseInt(top) * -1)
    }
  }, [visible])

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href") ?? ""
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return
      if (anchor.target === "_blank") return
      if (href.startsWith("http://") || href.startsWith("https://")) return
      setVisible(true)
      timeout = setTimeout(() => setVisible(false), 8000)
    }
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
      clearTimeout(timeout)
    }
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
