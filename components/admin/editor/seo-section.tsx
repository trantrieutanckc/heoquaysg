"use client"

import * as React from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SeoPanel } from "@/components/admin/seo-panel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slugify } from "@/lib/post-url"

interface Props {
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  seoImage: string
  previewTitle: string
  slug: string
  onChange: (field: "seoTitle" | "seoDescription" | "seoKeywords" | "seoImage", value: string) => void
  onSlugChange: (value: string) => void
}

export function EditorSeoSection({
  seoTitle, seoDescription, seoKeywords, seoImage, previewTitle, slug, onChange, onSlugChange,
}: Props) {
  return (
    <AccordionItem value="seo">
      <AccordionTrigger className="text-base font-medium">SEO</AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 space-y-4">
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold">URL Slug</Label>
            <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-3 py-1.5 text-sm">
              <span className="text-muted-foreground shrink-0">/posts/</span>
              <input
                value={slug}
                onChange={(e) => onSlugChange(slugify(e.target.value))}
                placeholder="ten-bai-viet"
                className="flex-1 bg-transparent outline-none font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tự động tạo từ tiêu đề nếu để trống. Chỉ chứa chữ thường, số và dấu gạch ngang.
            </p>
          </div>
          <SeoPanel
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            seoKeywords={seoKeywords}
            seoImage={seoImage}
            previewTitle={previewTitle}
            onChange={onChange}
          />
          <p className="text-xs text-muted-foreground">
            SEO và Slug sẽ được lưu khi nhấn <strong>Lưu</strong> phía trên.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
