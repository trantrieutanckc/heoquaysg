"use client"

import { cn } from "@/lib/utils"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/admin/image-uploader"

interface Props {
  imageTab: "upload" | "url"
  imageUrl: string
  imageAlt: string
  imageTitle: string
  onTabChange: (tab: "upload" | "url") => void
  onUrlChange: (url: string) => void
  onAltChange: (alt: string) => void
  onTitleChange: (title: string) => void
}

export function EditorImageSection({
  imageTab,
  imageUrl,
  imageAlt,
  imageTitle,
  onTabChange,
  onUrlChange,
  onAltChange,
  onTitleChange,
}: Props) {
  return (
    <AccordionItem value="image">
      <AccordionTrigger className="text-base font-medium">
        Ảnh bìa
        {imageUrl && (
          <span className="ml-2 text-xs text-muted-foreground font-normal truncate max-w-[200px]">
            {imageUrl}
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-4 pt-2">
          <div className="flex gap-1 rounded-md border bg-muted p-1">
            <button
              type="button"
              onClick={() => onTabChange("upload")}
              className={cn(
                "flex-1 rounded py-1.5 text-sm font-medium transition-colors",
                imageTab === "upload" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Tải lên
            </button>
            <button
              type="button"
              onClick={() => onTabChange("url")}
              className={cn(
                "flex-1 rounded py-1.5 text-sm font-medium transition-colors",
                imageTab === "url" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              URL
            </button>
          </div>

          {imageTab === "upload" ? (
            <ImageUploader value={imageUrl} onChange={onUrlChange} />
          ) : (
            <div className="grid gap-2">
              <Label>URL ảnh</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => onUrlChange(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Alt text</Label>
              <Input
                placeholder="Mô tả ảnh"
                value={imageAlt}
                onChange={(e) => onAltChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                placeholder="Tiêu đề ảnh"
                value={imageTitle}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Ảnh bìa sẽ được lưu khi nhấn <strong>Lưu</strong> phía trên.</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
