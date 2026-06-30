"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Props {
  bookable: boolean
  isSaving: boolean
  onToggle: () => void
}

export function EditorBookableSection({ bookable, isSaving, onToggle }: Props) {
  return (
    <AccordionItem value="bookable">
      <AccordionTrigger className="text-base font-medium">
        Trang đặt lịch
        <span className={`ml-2 text-xs font-normal ${bookable ? "text-green-600" : "text-muted-foreground"}`}>
          {bookable ? "Đang hiển thị" : "Đang ẩn"}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 space-y-3">
          <p className="text-sm text-muted-foreground">
            Khi bật, bài viết này sẽ hiện trong danh sách món có thể đặt trên trang <strong>/dat-lich</strong>.
          </p>
          <button
            type="button"
            onClick={onToggle}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${bookable ? "bg-primary" : "bg-muted-foreground/30"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${bookable ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <p className="text-xs text-muted-foreground">
            {bookable ? "Bài này đang hiện trên /dat-lich." : "Bài này đang ẩn khỏi /dat-lich."}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
