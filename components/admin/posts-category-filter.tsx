"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface Category {
  id: string
  name: string
}

function Inner({
  categories,
  defaultValue = "",
}: {
  categories: Category[]
  defaultValue?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set("cat", e.target.value)
    } else {
      params.delete("cat")
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring text-muted-foreground"
    >
      <option value="">Tất cả danh mục</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}

export function PostsCategoryFilter({
  categories,
  defaultValue,
}: {
  categories: Category[]
  defaultValue?: string
}) {
  return (
    <React.Suspense fallback={null}>
      <Inner categories={categories} defaultValue={defaultValue} />
    </React.Suspense>
  )
}
