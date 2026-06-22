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
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <Icons.search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm bài viết..."
        autoFocus
        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </form>
  )
}
