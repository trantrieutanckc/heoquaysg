"use client"

import { useRouter, usePathname } from "next/navigation"

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
  const pathname = usePathname()

  function select(slug: string | null) {
    if (slug) {
      router.push(`${pathname}?category=${slug}`, { scroll: false })
    } else {
      router.push(pathname, { scroll: false })
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-6 mb-8">
      <button
        onClick={() => select(null)}
        className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
          !activeCategory
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
        }`}
      >
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => select(cat.slug)}
          className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
            activeCategory === cat.slug
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
