"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"

export function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter()
  const [value, setValue] = React.useState(defaultValue)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center group">
      <Icons.search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nhập từ khoá tìm kiếm..."
        autoFocus
        className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-24 text-sm shadow-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        className="absolute right-2 inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Icons.search className="h-3 w-3" />
        Tìm
      </button>
    </form>
  )
}
