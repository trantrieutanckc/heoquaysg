"use client"

import * as React from "react"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useFunnyLoading } from "@/hooks/use-funny-loading"
import { FadeUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import Image from "next/image"
import { BLUR_PLACEHOLDER } from "@/lib/image"

interface Props {
  siteName: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
  contactZalo?: string
  contactIntro?: string
  heroImage?: string
}

export function ContactClient({ siteName, contactPhone, contactEmail, contactAddress, contactZalo, contactIntro, heroImage }: Props) {
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" })
  const funnyMsg = useFunnyLoading(saving)

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

  const bgImage = heroImage || "/images/shop/heo-quay-khay-1.jpg"

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden flex items-center" style={{ minHeight: "52vh" }}>
        <Image
          src={bgImage}
          alt={siteName}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        {/* dot pattern */}
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
          <svg width="100%" height="100%">
            <pattern id="contact-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#contact-dots)" />
          </svg>
        </div>

        <div className="relative z-10 w-full">
          <div className="container px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center text-center text-white">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300 mb-3">Liên hệ</p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl mb-5 leading-tight">
                {siteName}
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-0.5 w-12 bg-orange-400" />
                <div className="h-0.5 w-6 bg-orange-300/50" />
                <div className="h-0.5 w-3 bg-orange-200/30" />
              </div>
              <p className="text-white/80 max-w-xl text-lg leading-relaxed">
                {contactIntro || "Liên hệ để đặt hàng, hỏi về thực đơn, hoặc gửi góp ý cho chúng tôi."}
              </p>
            </FadeUp>

            {/* Quick CTA buttons */}
            {(contactPhone || contactZalo) && (
              <FadeUp delay={0.15}>
                <div className="flex flex-wrap gap-3 justify-center mt-8">
                  {contactPhone && (
                    <div className="relative inline-flex">
                      <span className="absolute inset-1 inline-flex rounded-full bg-green-500 opacity-50 animate-ping-sm" />
                      <a
                        href={`tel:${contactPhone.replace(/\s/g, "")}`}
                        className="relative inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        Gọi ngay
                      </a>
                    </div>
                  )}
                  {contactZalo && (
                    <div className="relative inline-flex">
                      <span className="absolute inset-1 inline-flex rounded-full bg-[#0068FF] opacity-50 animate-ping-md" />
                      <a
                        href={`https://zalo.me/${contactZalo.replace(/\s/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center gap-2 bg-[#0068FF] hover:bg-[#0050CC] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor">
                          <path d="M10 1C5.03 1 1 4.582 1 9c0 2.418 1.185 4.575 3.043 6.016L3.5 18.5l3.9-2c.84.32 1.74.5 2.6.5 4.97 0 9-3.582 9-8S14.97 1 10 1z" />
                        </svg>
                        Zalo
                      </a>
                    </div>
                  )}
                </div>
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────── */}
      <section className="container px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── Thông tin liên hệ ───────────────────────────────── */}
          <SlideInLeft>
            <div className="space-y-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Thông tin</p>
                <h2 className="font-heading text-2xl sm:text-3xl">Liên hệ với chúng tôi</h2>
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="h-1 w-10 rounded-full bg-primary" />
                  <div className="h-1 w-5 rounded-full bg-primary/40" />
                </div>
              </div>

              <StaggerContainer className="flex flex-col gap-4">
                {contactAddress && (
                  <StaggerItem>
                    <div className="flex gap-5 items-start p-5 border bg-card hover:border-primary/30 transition-colors group">
                      <div className="h-12 w-12 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wide mb-1">Địa chỉ</p>
                        <p className="text-muted-foreground leading-relaxed">{contactAddress}</p>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs font-semibold mt-2 inline-flex items-center gap-1"
                        >
                          Xem trên Google Maps
                          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </a>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {contactPhone && (
                  <StaggerItem>
                    <div className="flex gap-5 items-start p-5 border bg-card hover:border-primary/30 transition-colors group">
                      <div className="h-12 w-12 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wide mb-1">Điện thoại</p>
                        <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="text-foreground hover:text-primary transition-colors font-medium text-lg">
                          {contactPhone}
                        </a>
                        {contactZalo && (
                          <div className="mt-1.5">
                            <a
                              href={`https://zalo.me/${contactZalo.replace(/\s/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:underline"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z" />
                              </svg>
                              Nhắn Zalo
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {contactEmail && (
                  <StaggerItem>
                    <div className="flex gap-5 items-start p-5 border bg-card hover:border-primary/30 transition-colors group">
                      <div className="h-12 w-12 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wide mb-1">Email</p>
                        <a href={`mailto:${contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">{contactEmail}</a>
                      </div>
                    </div>
                  </StaggerItem>
                )}
              </StaggerContainer>

              {/* Map */}
              {contactAddress && (
                <div className="overflow-hidden border">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`}
                    className="w-full h-72 border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ"
                  />
                </div>
              )}
            </div>
          </SlideInLeft>

          {/* ── Form liên hệ ────────────────────────────────────── */}
          <SlideInRight>
            <div className="bg-card border p-8 sm:p-10">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Nhắn tin</p>
                <h2 className="font-heading text-2xl sm:text-3xl">Gửi tin nhắn cho chúng tôi</h2>
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="h-1 w-10 rounded-full bg-primary" />
                  <div className="h-1 w-5 rounded-full bg-primary/40" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">Họ tên *</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={set}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={set}
                      placeholder="email@example.com"
                      className="w-full border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider">Số điện thoại</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={set}
                      placeholder="0901 234 567"
                      className="w-full border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider">Nội dung *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={set}
                    required
                    rows={5}
                    placeholder="Bạn muốn đặt hàng, hỏi về thực đơn hoặc có góp ý gì?"
                    className="w-full border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60 w-full"
                >
                  {saving && <Icons.spinner className="h-4 w-4 animate-spin" />}
                  {saving ? funnyMsg : "Gửi tin nhắn"}
                </button>
              </form>
            </div>
          </SlideInRight>

        </div>
      </section>

    </div>
  )
}
