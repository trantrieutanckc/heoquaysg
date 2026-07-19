"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDate, cn } from "@/lib/utils"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { StarDisplay } from "@/components/star-display"

interface PostItem {
  id: string
  title: string
  createdAt: Date
  image: unknown
  avgRating: number | null
  ratingCount: number
  seoDescription?: string | null
  author: { name: string | null; image: string | null } | null
  categories: { category: { name: string; slug: string } }[]
}

const TABS = [
  { label: "Tất cả", slug: null },
  { label: "Heo Quay", slug: "heo-quay" },
  { label: "Vịt Quay", slug: "vit-quay" },
  { label: "Gà Quay", slug: "ga-quay" },
]

export function LatestPostsTabs({ posts, maxShow = 6 }: { posts: PostItem[]; maxShow?: number }) {
  const [active, setActive] = useState<string | null>("heo-quay")

  const filtered = active
    ? posts.filter((p) => p.categories.some((c) => c.category.slug === active))
    : posts

  const visible = filtered.slice(0, maxShow)

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-0 border-b mb-8">
        {TABS.map((tab) => (
          <button
            key={String(tab.slug)}
            onClick={() => setActive(tab.slug)}
            className={cn(
              "relative px-5 py-2.5 text-sm font-semibold transition-colors",
              "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:transition-[width] after:duration-300",
              active === tab.slug
                ? "text-primary after:w-full"
                : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => {
            const image = post.image as { url?: string; alt?: string } | null
            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group flex flex-col overflow-hidden border bg-card hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                  )}
                </div>
                <div className="flex flex-col gap-2.5 p-5 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    {post.categories.length > 0 ? (
                      <span className="font-bold uppercase tracking-wider text-primary">{post.categories[0].category.name}</span>
                    ) : (
                      <span />
                    )}
                    <time dateTime={post.createdAt.toISOString()} className="text-muted-foreground">
                      {formatDate(post.createdAt.toISOString())}
                    </time>
                  </div>
                  <h3 className="font-heading text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.seoDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.seoDescription}</p>
                  )}
                  {post.avgRating != null && post.ratingCount > 0 && (
                    <StarDisplay rating={post.avgRating} size="sm" showNumber count={post.ratingCount} />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-10 text-center">Chưa có bài viết nào.</p>
      )}
    </div>
  )
}
