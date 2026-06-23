"use client"

import * as React from "react"
import { motion } from "framer-motion"
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

  const contactItems = [
    { icon: "📍", label: "Địa chỉ", content: <p>47 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh</p> },
    { icon: "📞", label: "Điện thoại", content: <a href="tel:0901234567" className="hover:text-foreground transition-colors">0901 234 567</a> },
    { icon: "📧", label: "Email", content: <a href="mailto:heoquay47@gmail.com" className="hover:text-foreground transition-colors">heoquay47@gmail.com</a> },
    { icon: "🕐", label: "Giờ mở cửa", content: <p>06:00 – 20:00, tất cả các ngày trong tuần</p> },
  ]

  return (
    <div className="container py-6 lg:py-10">
      <motion.div
        className="flex flex-col items-start gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="space-y-2">
          <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">
            Liên hệ
          </h1>
          <p className="text-xl text-muted-foreground">
            Hãy để lại tin nhắn, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </motion.div>

      <hr className="my-8" />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Thông tin liên hệ */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-heading text-2xl">Thông tin liên hệ</h2>

          <div className="space-y-4 text-muted-foreground">
            {contactItems.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex gap-3"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  {item.content}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="rounded-lg border bg-muted/40 p-6 space-y-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>
        </motion.div>

        {/* Form liên hệ */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>
      </div>
    </div>
  )
}
