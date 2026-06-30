"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { SiteConfigData } from "@/components/admin/site-config-form"
import { SaveOverlay } from "@/components/ui/save-overlay"

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-sm">{title}</h2>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function ContactEditorForm({ initial }: { initial: SiteConfigData }) {
  const [data, setData] = React.useState<SiteConfigData>(initial)
  const [saving, setSaving] = React.useState(false)

  function set(key: keyof SiteConfigData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) toast({ variant: "success", description: "Đã lưu trang Liên hệ." })
    else toast({ description: "Có lỗi xảy ra.", variant: "destructive" })
  }

  return (
    <>
    <SaveOverlay visible={saving} />
    <form onSubmit={handleSave} className="space-y-5">

      {/* Intro */}
      <Section title="Đoạn giới thiệu" desc="Hiển thị bên dưới tiêu đề trang liên hệ.">
        <Field label="Nội dung" hint="Để trống → dùng nội dung mặc định">
          <Textarea
            value={data.contactIntro ?? ""}
            onChange={set("contactIntro")}
            placeholder="Liên hệ để đặt hàng, hỏi về thực đơn, hoặc gửi góp ý. Chúng tôi nhận đặt trước cho tiệc, sự kiện và giao hàng tận nơi."
            className="min-h-[90px] resize-y"
          />
        </Field>
      </Section>

      {/* Contact details */}
      <Section title="Thông tin liên hệ" desc="Hiển thị trên trang Liên hệ và trang Về chúng tôi.">
        <Field label="Số điện thoại">
          <Input value={data.contactPhone ?? ""} onChange={set("contactPhone")} placeholder="0901 234 567" />
        </Field>
        <Field label="Zalo">
          <Input value={data.contactZalo ?? ""} onChange={set("contactZalo")} placeholder="0901 234 567" />
        </Field>
        <Field label="Email">
          <Input type="email" value={data.contactEmail ?? ""} onChange={set("contactEmail")} placeholder="info@heoquay.com" />
        </Field>
        <Field label="Địa chỉ">
          <Input value={data.contactAddress ?? ""} onChange={set("contactAddress")} placeholder="123 Đường ABC, Bình Tân, TP.HCM" />
        </Field>
        <Field label="Giờ mở cửa">
          <Input value={data.businessHours ?? ""} onChange={set("businessHours")} placeholder="06:00 – 20:00, tất cả các ngày" />
        </Field>
      </Section>

      {/* Social */}
      <Section title="Mạng xã hội">
        <Field label="Facebook">
          <Input value={data.socialFacebook ?? ""} onChange={set("socialFacebook")} placeholder="https://facebook.com/..." />
        </Field>
        <Field label="Instagram">
          <Input value={data.socialInstagram ?? ""} onChange={set("socialInstagram")} placeholder="https://instagram.com/..." />
        </Field>
        <Field label="YouTube">
          <Input value={data.socialYoutube ?? ""} onChange={set("socialYoutube")} placeholder="https://youtube.com/..." />
        </Field>
      </Section>

      <Button type="submit" disabled={saving}>
        Lưu trang Liên hệ
      </Button>
    </form>
    </>
  )
}
