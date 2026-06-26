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

  // Blur main content khi mở search (không blur header vì search nằm trong header)
  React.useEffect(() => {
    const main = document.querySelector("main")
    if (open) {
      if (main) { main.style.filter = "blur(6px)"; main.style.transition = "filter 0.15s" }
      document.body.style.overflow = "hidden"
    } else {
      if (main) { main.style.filter = ""; main.style.transition = "" }
      document.body.style.overflow = ""
    }
    return () => {
      if (main) { main.style.filter = ""; main.style.transition = "" }
      document.body.style.overflow = ""
    }
  }, [open])

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
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border bg-muted/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Tìm kiếm"
      >
        <Icons.search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline text-xs">Tìm kiếm...</span>
        <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border bg-background px-1 text-[10px] font-mono text-muted-foreground">
          ⌃K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <>
          {/* Backdrop — cùng màu background với menu */}
          <div
            className="fixed inset-0 z-[100] bg-background/80"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-16 sm:pt-24 px-4 pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-xl animate-in fade-in-0 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl">
              {/* Search input row */}
              <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-b">
                <Icons.search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {value ? (
                  <button
                    type="button"
                    onClick={() => { setValue(""); inputRef.current?.focus() }}
                    className="rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icons.close className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
                    Esc
                  </kbd>
                )}
              </form>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
                <span className="text-xs text-muted-foreground">
                  Nhấn <kbd className="rounded border bg-background px-1 py-0.5 text-[10px] font-mono">Enter</kbd> để tìm
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </>
  )
}
