"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SeoPanel } from "@/components/admin/seo-panel"

interface Props {
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  seoImage: string
  previewTitle: string
  onChange: (field: "seoTitle" | "seoDescription" | "seoKeywords" | "seoImage", value: string) => void
}

export function EditorSeoSection({
  seoTitle,
  seoDescription,
  seoKeywords,
  seoImage,
  previewTitle,
  onChange,
}: Props) {
  return (
    <AccordionItem value="seo">
      <AccordionTrigger className="text-base font-medium">SEO</AccordionTrigger>
      <AccordionContent>
        <div className="pt-2">
          <SeoPanel
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            seoKeywords={seoKeywords}
            seoImage={seoImage}
            previewTitle={previewTitle}
            onChange={onChange}
          />
          <p className="text-xs text-muted-foreground mt-4">
            SEO sẽ được lưu khi nhấn <strong>Lưu</strong> phía trên.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
