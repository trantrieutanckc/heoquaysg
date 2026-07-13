"use client"

import * as React from "react"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface Props {
  siteName: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
  businessHours?: string
  contactZalo?: string
  contactIntro?: string
}

export function ContactClient({ siteName, contactPhone, contactEmail, contactAddress, businessHours, contactZalo, contactIntro }: Props) {
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" })

  function set(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ variant: "success", title: "Gửi thành công!", description: "Chúng tôi sẽ liên hệ lại với bạn sớm nhất." })
        setForm({ name: "", email: "", phone: "", message: "" })
      } else throw new Error()
    } catch {
      toast({ title: "Gửi thất bại", description: "Vui lòng thử lại sau.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="border-b bg-card">
        <div className="container px-4 sm:px-6 py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Liên hệ</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl mb-4">{siteName} — Đặt hàng & Tư vấn</h1>
          <div className="flex items-center gap-1.5 mb-5">
            <div className="h-0.5 w-10 bg-primary" />
            <div className="h-0.5 w-4 bg-primary/40" />
            <div className="h-0.5 w-2 bg-primary/20" />
          </div>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            {contactIntro || "Liên hệ để đặt hàng, hỏi về thực đơn, hoặc gửi góp ý. Chúng tôi nhận đặt trước cho tiệc, sự kiện và giao hàng tận nơi."}
          </p>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* ── Thông tin liên hệ ─────────────────────────────── */}
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Thông tin</p>
              <h2 className="font-heading text-2xl sm:text-3xl">Liên hệ với chúng tôi</h2>
              <div className="flex items-center gap-1.5 mt-2.5">
                <div className="h-0.5 w-10 bg-primary" />
                <div className="h-0.5 w-4 bg-primary/40" />
                <div className="h-0.5 w-2 bg-primary/20" />
              </div>
            </div>

            <div className="flex flex-col gap-5 text-sm">
              {contactAddress && (
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Địa chỉ</p>
                    <p className="text-muted-foreground leading-relaxed">{contactAddress}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs font-medium mt-1 inline-block"
                    >
                      Xem trên bản đồ →
                    </a>
                  </div>
                </div>
              )}

              {contactPhone && (
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Điện thoại</p>
                    <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="text-muted-foreground hover:text-primary transition-colors">{contactPhone}</a>
                    {contactZalo && (
                      <a
                        href={`https://zalo.me/${contactZalo.replace(/\s/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 text-xs font-medium text-blue-500 hover:underline"
                      >
                        Zalo →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {contactEmail && (
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Email</p>
                    <a href={`mailto:${contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">{contactEmail}</a>
                  </div>
                </div>
              )}

              {businessHours && (
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Giờ mở cửa</p>
                    <p className="text-muted-foreground">{businessHours}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            {contactAddress && (
              <div className="border overflow-hidden">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`}
                  className="w-full h-64 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ"
                />
              </div>
            )}
          </div>

          {/* ── Form liên hệ ──────────────────────────────────── */}
          <div>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Nhắn tin</p>
              <h2 className="font-heading text-2xl sm:text-3xl">Gửi tin nhắn cho chúng tôi</h2>
              <div className="flex items-center gap-1.5 mt-2.5">
                <div className="h-0.5 w-10 bg-primary" />
                <div className="h-0.5 w-4 bg-primary/40" />
                <div className="h-0.5 w-2 bg-primary/20" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-1.5">
                <label htmlFor="name" className="text-sm font-medium">Họ tên *</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={set}
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={set}
                    placeholder="email@example.com"
                    className="w-full border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="phone" className="text-sm font-medium">Số điện thoại</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={set}
                    placeholder="0901 234 567"
                    className="w-full border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="message" className="text-sm font-medium">Nội dung *</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={set}
                  required
                  rows={5}
                  placeholder="Bạn muốn đặt hàng, hỏi về thực đơn hoặc có góp ý gì?"
                  className="w-full border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60 w-full sm:w-auto"
              >
                {saving && <Icons.spinner className="h-4 w-4 animate-spin" />}
                {saving ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
