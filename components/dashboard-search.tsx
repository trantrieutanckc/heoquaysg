"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"

interface Result {
  id: string
  title: string
  subtitle?: string
  href: string
  type: "post" | "category" | "user"
}

const TYPE_LABEL = { post: "Bài viết", category: "Category", user: "User" }
const TYPE_ICON: Record<string, keyof typeof Icons> = {
  post: "post",
  category: "page",
  user: "user",
}

export function DashboardSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Result[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Ctrl+K
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
      setResults([])
      setSelected(0)
    }
  }, [open])

  // Debounce search
  React.useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/dashboard/search?q=${encodeURIComponent(query)}`)
        if (res.ok) setResults(await res.json())
      } finally {
        setLoading(false)
        setSelected(0)
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  function navigate(href: string) {
    setOpen(false)
    router.push(href)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].href)
    }
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
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg rounded-lg border bg-background shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center border-b px-3">
              {loading
                ? <Icons.spinner className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                : <Icons.search className="h-4 w-4 shrink-0 text-muted-foreground" />
              }
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm bài viết, category, user..."
                className="flex-1 bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")}>
                  <Icons.close className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ul className="max-h-72 overflow-y-auto py-2">
                {results.map((r, i) => {
                  const IconComp = Icons[TYPE_ICON[r.type]]
                  return (
                    <li key={r.id}>
                      <button
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                          i === selected ? "bg-accent" : "hover:bg-accent"
                        }`}
                        onMouseEnter={() => setSelected(i)}
                        onClick={() => navigate(r.href)}
                      >
                        <IconComp className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{r.title}</p>
                          {r.subtitle && (
                            <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>
                          )}
                        </div>
                        <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                          {TYPE_LABEL[r.type]}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {query && !loading && results.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy kết quả nào.
              </p>
            )}

            <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
              <span>↑↓ chọn · Enter mở · Esc đóng</span>
              <span>Ctrl K</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
