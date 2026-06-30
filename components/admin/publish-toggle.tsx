"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface PublishToggleProps {
  id: string
  published: boolean
  endpoint: "posts" | "categories"
}

export function PublishToggle({ id, published, endpoint }: PublishToggleProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPublished, setIsPublished] = React.useState(published)

  async function toggle() {
    setIsLoading(true)
    const next = !isPublished
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      })
      if (!res.ok) throw new Error()
      setIsPublished(next)
      router.refresh()
      toast({
        variant: "success",
        description: next ? "Đã đăng." : "Đã chuyển về nháp.",
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
      title={isPublished ? "Chuyển về nháp" : "Đăng bài"}
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors disabled:opacity-50
        ${isPublished
          ? "border-green-400 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900"
          : "border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
    >
      {isLoading ? (
        <Icons.spinner className="h-3.5 w-3.5 animate-spin" />
      ) : isPublished ? (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Đã đăng
        </>
      ) : (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          Nháp
        </>
      )}
    </button>
  )
}
