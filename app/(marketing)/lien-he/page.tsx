"use client"

import * as React from "react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({
          title: "Gửi thành công!",
          description: "Chúng tôi sẽ liên hệ lại với bạn sớm nhất.",
        })
        setForm({ name: "", email: "", phone: "", message: "" })
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Gửi thất bại",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-5xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4">
        <div className="space-y-2">
          <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">
            Liên hệ
          </h1>
          <p className="text-xl text-muted-foreground">
            Hãy để lại tin nhắn, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Thông tin liên hệ */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl">Thông tin liên hệ</h2>

          <div className="space-y-4 text-muted-foreground">
            <div className="flex gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-medium text-foreground">Địa chỉ</p>
                <p>47 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="font-medium text-foreground">Điện thoại</p>
                <a href="tel:0901234567" className="hover:text-foreground transition-colors">
                  0901 234 567
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <a href="mailto:heoquay47@gmail.com" className="hover:text-foreground transition-colors">
                  heoquay47@gmail.com
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">🕐</span>
              <div>
                <p className="font-medium text-foreground">Giờ mở cửa</p>
                <p>06:00 – 20:00, tất cả các ngày trong tuần</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-6 space-y-2">
            <h3 className="font-medium">Đặt hàng nhanh</h3>
            <p className="text-sm text-muted-foreground">
              Gọi trực tiếp để đặt hàng hoặc hỏi về thực đơn. Chúng tôi nhận đặt trước cho tiệc, sự kiện và giao hàng tận nơi.
            </p>
            <a
              href="tel:0901234567"
              className="inline-flex items-center gap-2 mt-2 text-sm font-medium underline underline-offset-4"
            >
              Gọi ngay: 0901 234 567
            </a>
          </div>
        </div>

        {/* Form liên hệ */}
        <div>
          <h2 className="font-heading text-2xl mb-6">Gửi tin nhắn</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0901 234 567"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Nội dung *</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Bạn muốn hỏi về sản phẩm, đặt hàng, hay có góp ý gì cho chúng tôi?"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
