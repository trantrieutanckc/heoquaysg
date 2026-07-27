"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Icons } from "@/components/icons"

function Inner({ placeholder, paramKey = "q" }: { placeholder?: string; paramKey?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = React.useState(searchParams.get(paramKey) ?? "")

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set(paramKey, value.trim())
      } else {
        params.delete(paramKey)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    }, 300)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="relative">
      <Icons.search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Tìm kiếm..."}
        className="h-9 w-52 rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <Icons.close className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

export function DashboardSearchInput({
  placeholder,
  paramKey,
}: {
  placeholder?: string
  paramKey?: string
}) {
  return (
    <React.Suspense fallback={null}>
      <Inner placeholder={placeholder} paramKey={paramKey} />
    </React.Suspense>
  )
}
