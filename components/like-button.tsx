"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  postId: string
  initialLikes: number
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const storageKey = `liked:${postId}`
  const [liked, setLiked] = React.useState(false)
  const [likes, setLikes] = React.useState(initialLikes)
  const [pending, setPending] = React.useState(false)

  React.useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "1")
  }, [storageKey])

  async function toggle() {
    if (pending) return
    const action = liked ? "unlike" : "like"
    setPending(true)

    // Optimistic update
    setLiked(!liked)
    setLikes((n) => (action === "like" ? n + 1 : Math.max(0, n - 1)))

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
        if (action === "like") {
          localStorage.setItem(storageKey, "1")
        } else {
          localStorage.removeItem(storageKey)
        }
      } else {
        // Rollback
        setLiked(liked)
        setLikes((n) => (action === "like" ? Math.max(0, n - 1) : n + 1))
      }
    } catch {
      setLiked(liked)
      setLikes((n) => (action === "like" ? Math.max(0, n - 1) : n + 1))
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={liked ? "Bỏ thích" : "Thích bài viết"}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all",
        liked
          ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
          : "border-border bg-background text-muted-foreground hover:border-rose-400 hover:text-rose-500"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn(
          "h-5 w-5 transition-transform group-hover:scale-110",
          liked ? "fill-rose-500 stroke-rose-500" : "fill-none stroke-current"
        )}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{likes > 0 ? likes : ""} {liked ? "Đã thích" : "Thích"}</span>
    </button>
  )
}
