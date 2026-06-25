"use client"

import { useState, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { PostItem } from "@/components/post-item"
import { BulkActionBar } from "@/components/bulk-action-bar"

interface Post {
  id: string
  title: string
  published: boolean
  featured: boolean | null
  createdAt: Date
  image: unknown
  likes: number
  categories: { category: { id: string; name: string; slug: string } }[]
}

interface PostListProps {
  posts: Post[]
  allCategories: { id: string; name: string }[]
}

const BULK_ACTIONS = [
  { label: "Đăng tất cả", action: "publish", variant: "default" as const },
  { label: "Huỷ đăng", action: "unpublish", variant: "outline" as const },
  { label: "Xoá", action: "delete", variant: "destructive" as const, confirm: true },
]

export function PostList({ posts, allCategories }: PostListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setSelected((prev) =>
      prev.size === posts.length ? new Set() : new Set(posts.map((p) => p.id))
    )
  }, [posts])

  const allSelected = selected.size === posts.length && posts.length > 0
  const someSelected = selected.size > 0 && selected.size < posts.length

  return (
    <>
      <div>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-2 border rounded-t-md bg-muted/40">
        <Checkbox
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={toggleAll}
          aria-label="Chọn tất cả"
        />
        <span className="text-xs text-muted-foreground">
          {selected.size > 0 ? `${selected.size} đã chọn` : "Chọn tất cả"}
        </span>
      </div>

      <div className="divide-y divide-border rounded-b-md border border-t-0">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-2 pr-4">
            <div className="pl-4 py-4 shrink-0">
              <Checkbox
                checked={selected.has(post.id)}
                onCheckedChange={() => toggle(post.id)}
                aria-label={`Chọn ${post.title}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <PostItem post={post} allCategories={allCategories} />
            </div>
          </div>
        ))}
      </div>
      </div>

      <BulkActionBar
        selectedCount={selected.size}
        selectedIds={[...selected]}
        actions={BULK_ACTIONS}
        apiEndpoint="/api/posts/bulk"
        onClear={() => setSelected(new Set())}
      />
    </>
  )
}
