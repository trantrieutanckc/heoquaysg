"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface Category {
  slug: string
  name: string
}

interface CategoryFilterTabsProps {
  categories: Category[]
  activeCategory: string | null
}

export function CategoryFilterTabs({ categories, activeCategory }: CategoryFilterTabsProps) {
  const router = useRouter()
  const [current, setCurrent] = useState(activeCategory)

  function select(slug: string | null) {
    setCurrent(slug)
    const url = new URL(window.location.href)
    if (slug) {
      url.searchParams.set("category", slug)
    } else {
      url.searchParams.delete("category")
    }
    window.history.pushState(null, "", url.toString())
    router.refresh()
  }

  const tabs = [{ slug: null, name: "Tất cả" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))]

  return (
    <div className="flex border-b border-border mt-6 mb-8 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.slug === null ? !current : current === tab.slug
        return (
          <button
            key={tab.slug ?? "__all__"}
            onClick={() => select(tab.slug)}
            className={`relative shrink-0 px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}
