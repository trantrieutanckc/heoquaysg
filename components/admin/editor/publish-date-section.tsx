"use client"

import * as React from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Props {
  createdAt: Date | undefined
  onChange: (date: Date) => void
  onSave: (date: Date) => Promise<void>
}

export function EditorPublishDateSection({ createdAt, onChange, onSave }: Props) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(createdAt)
  const [time, setTime] = React.useState(createdAt ? format(createdAt, "HH:mm") : "08:00")
  const [isSaving, setIsSaving] = React.useState(false)

  async function handleConfirm() {
    if (!date) return
    const [h, m] = time.split(":").map(Number)
    const dt = new Date(date)
    dt.setHours(h, m, 0, 0)
    onChange(dt)
    setOpen(false)
    setIsSaving(true)
    try {
      await onSave(dt)
    } finally {
      setIsSaving(false)
    }
  }

  const displayDate = createdAt
    ? format(createdAt, "HH:mm - dd/MM/yyyy", { locale: vi })
    : "Chưa đặt"

  return (
    <AccordionItem value="publish-date">
      <AccordionTrigger className="text-base font-medium">
        Ngày tạo bài
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 space-y-3">
          <p className="text-xs text-muted-foreground">
            Ngày hiển thị trên bài viết. Thay đổi ở đây sẽ ảnh hưởng ngày xuất hiện trên trang và RSS.
          </p>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium tabular-nums">{displayDate}</div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Thay đổi
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
                <div className="p-3 border-t space-y-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs text-muted-foreground">Giờ</Label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    disabled={!date || isSaving}
                    onClick={handleConfirm}
                  >
                    {isSaving ? "Đang lưu..." : "Xác nhận"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
