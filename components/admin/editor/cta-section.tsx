"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/admin/image-uploader"

interface Props {
  ctaEnabled: boolean
  ctaTitle: string
  ctaDesc: string
  ctaImage: string
  ctaBtn2Label: string
  ctaBtn2Url: string
  onToggle: () => void
  onTitleChange: (v: string) => void
  onDescChange: (v: string) => void
  onImageChange: (v: string) => void
  onBtn2LabelChange: (v: string) => void
  onBtn2UrlChange: (v: string) => void
}

export function EditorCtaSection({ ctaEnabled, ctaTitle, ctaDesc, ctaImage, ctaBtn2Label, ctaBtn2Url, onToggle, onTitleChange, onDescChange, onImageChange, onBtn2LabelChange, onBtn2UrlChange }: Props) {
  return (
    <AccordionItem value="cta">
      <AccordionTrigger className="text-base font-medium">
        Banner cuối bài
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
              {ctaEnabled ? "Hiển thị banner cuối bài" : "Ẩn banner cuối bài"}
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
                <Label className="text-xs">Ảnh minh hoạ <span className="text-muted-foreground font-normal">(để trống dùng ảnh heo quay mặc định)</span></Label>
                <ImageUploader value={ctaImage} onChange={onImageChange} />
              </div>
              <div className="border-t pt-3 space-y-2.5">
                <p className="text-xs font-medium text-muted-foreground">Nút phụ (bên cạnh "Gọi ngay")</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Nhãn <span className="text-muted-foreground font-normal">(để trống = "Xem thực đơn")</span></Label>
                    <Input
                      value={ctaBtn2Label}
                      onChange={(e) => onBtn2LabelChange(e.target.value)}
                      placeholder="Xem thực đơn"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Link <span className="text-muted-foreground font-normal">(để trống = /thuc-don)</span></Label>
                    <Input
                      value={ctaBtn2Url}
                      onChange={(e) => onBtn2UrlChange(e.target.value)}
                      placeholder="/thuc-don"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
