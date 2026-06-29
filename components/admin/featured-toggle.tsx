"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface FeaturedToggleProps {
  postId: string
  featured: boolean
}

export function FeaturedToggle({ postId, featured }: FeaturedToggleProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFeatured, setIsFeatured] = React.useState(featured)

  async function toggle() {
    setIsLoading(true)
    const next = !isFeatured
    try {
      const res = await fetch(`/api/posts/${postId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: next }),
      })
      if (!res.ok) throw new Error()
      setIsFeatured(next)
      router.refresh()
      toast({
        description: next ? "Đã đặt làm bài nổi bật." : "Đã bỏ bài nổi bật.",
      })
    } catch {
      toast({ description: "Có lỗi xảy ra.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      title={isFeatured ? "Bỏ nổi bật" : "Đặt làm nổi bật"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors
        ${isFeatured
          ? "border-yellow-400 bg-yellow-50 text-yellow-500 hover:bg-yellow-100 dark:bg-yellow-950 dark:hover:bg-yellow-900"
          : "border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
        } disabled:opacity-50`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4"
        fill={isFeatured ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  )
}
