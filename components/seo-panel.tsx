"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/image-uploader"

interface SeoPanelProps {
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  seoImage: string
  onChange: (field: "seoTitle" | "seoDescription" | "seoKeywords" | "seoImage", value: string) => void
  previewTitle?: string
}

export function SeoPanel({ seoTitle, seoDescription, seoKeywords, seoImage, onChange, previewTitle }: SeoPanelProps) {
  const displayTitle = seoTitle || previewTitle || ""
  const descLen = seoDescription.length
  const titleLen = displayTitle.length

  return (
    <div className="grid gap-4">
      {/* Google preview */}
      <div className="rounded-md border bg-muted/40 p-4 text-sm space-y-0.5">
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Xem trước Google</p>
        <p className="text-blue-600 dark:text-blue-400 font-medium truncate text-base leading-snug">
          {displayTitle || "Tiêu đề trang"}
        </p>
        <p className="text-green-700 dark:text-green-500 text-xs">
          {typeof window !== "undefined" ? window.location.origin : "https://yoursite.com"}/...
        </p>
        <p className="text-muted-foreground text-xs line-clamp-2">
          {seoDescription || "Mô tả trang sẽ hiển thị ở đây. Nên từ 120–160 ký tự để đầy đủ trên Google."}
        </p>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seo-title">SEO Title</Label>
          <span className={`text-xs ${titleLen > 60 ? "text-destructive" : "text-muted-foreground"}`}>
            {titleLen}/60
          </span>
        </div>
        <Input
          id="seo-title"
          placeholder="Tiêu đề SEO (mặc định dùng tiêu đề bài viết)"
          value={seoTitle}
          onChange={(e) => onChange("seoTitle", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seo-desc">Meta Description</Label>
          <span className={`text-xs ${descLen > 160 ? "text-destructive" : descLen > 120 ? "text-yellow-500" : "text-muted-foreground"}`}>
            {descLen}/160
          </span>
        </div>
        <textarea
          id="seo-desc"
          rows={3}
          placeholder="Mô tả ngắn hiển thị trên Google (120–160 ký tự)"
          value={seoDescription}
          onChange={(e) => onChange("seoDescription", e.target.value)}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="seo-keywords">Keywords</Label>
        <Input
          id="seo-keywords"
          placeholder="VD: công nghệ, lập trình, nextjs (phân cách bằng dấu phẩy)"
          value={seoKeywords}
          onChange={(e) => onChange("seoKeywords", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>OG Image (Facebook / Twitter)</Label>
        <ImageUploader
          value={seoImage}
          onChange={(url) => onChange("seoImage", url)}
        />
        {!seoImage && (
          <p className="text-xs text-muted-foreground">Để trống sẽ tự tạo ảnh từ tiêu đề</p>
        )}
      </div>
    </div>
  )
}
