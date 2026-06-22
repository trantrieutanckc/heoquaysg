"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(buttonVariants({ variant: "ghost" }), className)}
    >
      <Icons.chevronLeft className="mr-2 h-4 w-4" />
      Quay lại
    </button>
  )
}
