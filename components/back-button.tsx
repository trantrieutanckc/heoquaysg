"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn("inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group", className)}
    >
      <span className="relative inline-flex items-center gap-1">
        <Icons.chevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Quay lại
        <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] bg-primary w-0 group-hover:w-full transition-[width] duration-500" />
      </span>
    </button>
  )
}
