"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"

export function SearchButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Ctrl+K hoặc /
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && document.activeElement?.tagName !== "INPUT")) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    setOpen(false)
    setValue("")
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
      >
        <Icons.search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Tìm kiếm</span>
        <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-background px-1 text-[10px] font-mono">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg rounded-lg border bg-background shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex items-center border-b px-3">
              <Icons.search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="flex-1 bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              {value && (
                <button type="button" onClick={() => setValue("")}>
                  <Icons.close className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </form>
            <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
              <span>Enter để tìm kiếm</span>
              <span>Esc để đóng</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
