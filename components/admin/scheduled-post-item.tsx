"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format, formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Clock, Pencil, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { BLUR_PLACEHOLDER } from "@/lib/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface ScheduledPost {
  id: string
  title: string
  scheduledAt: Date
  image: unknown
  categories: { category: { name: string } }[]
  author: { name: string | null }
}

export function ScheduledPostItem({ post }: { post: ScheduledPost }) {
  const router = useRouter()
  const [isCanceling, setIsCanceling] = useState(false)
  const image = post.image as { url?: string; alt?: string } | null
  const isPast = new Date(post.scheduledAt) <= new Date()

  async function handleCancel() {
    setIsCanceling(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: null }),
      })
      if (res.ok) {
        toast({ variant: "success", description: "Đã huỷ lịch đăng bài." })
        router.refresh()
      } else {
        toast({ title: "Lỗi", description: "Không thể huỷ lịch.", variant: "destructive" })
      }
    } finally {
      setIsCanceling(false)
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-0">
      {/* Thumbnail */}
      {image?.url ? (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={image.url}
            alt={image.alt || post.title}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        </div>
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-md bg-muted flex items-center justify-center">
          <Clock className="h-5 w-5 text-muted-foreground/40" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{post.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
            isPast ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
          }`}>
            <Clock className="h-3 w-3" />
            {format(new Date(post.scheduledAt), "HH:mm, dd/MM/yyyy")}
          </span>
          {isPast && (
            <span className="text-xs text-red-500 font-medium">(đang chờ cron)</span>
          )}
          {!isPast && (
            <span className="text-xs text-muted-foreground">
              — {formatDistanceToNow(new Date(post.scheduledAt), { addSuffix: true, locale: vi })}
            </span>
          )}
          {post.categories.length > 0 && (
            <span className="text-xs text-muted-foreground">
              · {post.categories.map((c) => c.category.name).join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/editor/${post.id}`}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Sửa
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isCanceling}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Huỷ lịch
        </Button>
      </div>
    </div>
  )
}
