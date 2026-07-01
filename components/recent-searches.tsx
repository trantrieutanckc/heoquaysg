"use client"

import Link from "next/link"

export function RecentSearches({ queries }: { queries: string[] }) {
  if (queries.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Tìm gần đây:</span>
      {queries.map((q) => (
        <Link
          key={q}
          href={`/search?q=${encodeURIComponent(q)}`}
          className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm hover:border-primary hover:text-primary transition-colors"
        >
          {q}
        </Link>
      ))}
    </div>
  )
}
