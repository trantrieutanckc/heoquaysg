"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  price: string
  onChange: (price: string) => void
}

export function EditorPriceSection({ price, onChange }: Props) {
  return (
    <AccordionItem value="price">
      <AccordionTrigger className="text-base font-medium">
        Giá
        {price && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            {Number(price).toLocaleString("vi-VN")}đ
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-2 pt-2">
          <Label>Giá niêm yết (VNĐ)</Label>
          <Input
            type="number"
            min="0"
            step="1000"
            placeholder="VD: 150000"
            value={price}
            onChange={(e) => onChange(e.target.value)}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">Để trống nếu không hiển thị giá.</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
