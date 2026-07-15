"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  ctaEnabled: boolean
  ctaTitle: string
  ctaDesc: string
  ctaImage: string
  onToggle: () => void
  onTitleChange: (v: string) => void
  onDescChange: (v: string) => void
  onImageChange: (v: string) => void
}

export function EditorCtaSection({ ctaEnabled, ctaTitle, ctaDesc, ctaImage, onToggle, onTitleChange, onDescChange, onImageChange }: Props) {
  return (
    <AccordionItem value="cta">
      <AccordionTrigger className="text-base font-medium">
        Banner đặt lịch
        <span className={`ml-2 text-xs font-normal ${ctaEnabled ? "text-green-600" : "text-muted-foreground"}`}>
          {ctaEnabled ? "Đang hiển thị" : "Đang ẩn"}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${ctaEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${ctaEnabled ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-sm text-muted-foreground">
              {ctaEnabled ? "Hiển thị banner đặt lịch cuối bài" : "Ẩn banner đặt lịch"}
            </span>
          </div>

          {ctaEnabled && (
            <div className="space-y-3 pt-1">
              <div className="grid gap-1.5">
                <Label className="text-xs">Tiêu đề <span className="text-muted-foreground font-normal">(để trống = dùng mặc định)</span></Label>
                <Input
                  value={ctaTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Muốn đặt món hoặc hỏi thêm?"
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Mô tả <span className="text-muted-foreground font-normal">(để trống = dùng mặc định)</span></Label>
                <Input
                  value={ctaDesc}
                  onChange={(e) => onDescChange(e.target.value)}
                  placeholder="Liên hệ với chúng tôi để được tư vấn và đặt hàng nhanh nhất."
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Ảnh minh hoạ <span className="text-muted-foreground font-normal">(URL — để trống dùng ảnh heo quay mặc định)</span></Label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={ctaImage}
                    onChange={(e) => onImageChange(e.target.value)}
                    placeholder="https://... hoặc /images/..."
                    className="text-sm flex-1"
                  />
                  {ctaImage && (
                    <img src={ctaImage} alt="" className="h-10 w-10 rounded object-cover border shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
