"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"

export interface SiteConfigData {
  siteName?: string
  siteTagline?: string
  siteDescription?: string
  logoUrl?: string
  heroImage?: string
  contactPhone?: string
  contactZalo?: string
  contactEmail?: string
  contactAddress?: string
  businessHours?: string
  socialFacebook?: string
  socialInstagram?: string
  socialYoutube?: string
  googleVerification?: string
  trackingCode?: string
}

interface SiteConfigFormProps {
  initial: SiteConfigData
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <h2 className="font-heading text-base font-semibold">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

export function SiteConfigForm({ initial }: SiteConfigFormProps) {
  const [data, setData] = React.useState<SiteConfigData>(initial)
  const [saving, setSaving] = React.useState(false)

  function set(key: keyof SiteConfigData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
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
    if (res.ok) {
      toast({ description: "Đã lưu cấu hình." })
    } else {
      toast({ description: "Có lỗi xảy ra.", variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Section title="Thông tin site">
        <Field label="Tên site" id="siteName">
          <Input id="siteName" value={data.siteName ?? ""} onChange={set("siteName")} placeholder="Heo Quay SG" />
        </Field>
        <Field label="Tagline" id="siteTagline">
          <Input id="siteTagline" value={data.siteTagline ?? ""} onChange={set("siteTagline")} placeholder="Heo quay ngon nhất Sài Gòn" />
        </Field>
        <Field label="Mô tả ngắn" id="siteDescription">
          <Input id="siteDescription" value={data.siteDescription ?? ""} onChange={set("siteDescription")} placeholder="Chuyên heo quay, bánh mì thịt..." />
        </Field>
        <Field label="URL Logo" id="logoUrl">
          <Input id="logoUrl" value={data.logoUrl ?? ""} onChange={set("logoUrl")} placeholder="https://..." />
          {data.logoUrl && (
            <img src={data.logoUrl} alt="Logo preview" className="h-10 w-10 rounded-full object-cover border mt-1" />
          )}
        </Field>
        <Field label="Ảnh Hero Banner (trang chủ)" id="heroImage">
          <Input id="heroImage" value={data.heroImage ?? ""} onChange={set("heroImage")} placeholder="https://... (URL ảnh nền hero)" />
          {data.heroImage && (
            <img src={data.heroImage} alt="Hero preview" className="h-24 w-full rounded-lg object-cover border mt-1" />
          )}
        </Field>
      </Section>

      <Section title="Liên hệ">
        <Field label="Số điện thoại" id="contactPhone">
          <Input id="contactPhone" value={data.contactPhone ?? ""} onChange={set("contactPhone")} placeholder="0901 234 567" />
        </Field>
        <Field label="Zalo (số điện thoại Zalo)" id="contactZalo">
          <Input id="contactZalo" value={data.contactZalo ?? ""} onChange={set("contactZalo")} placeholder="0901 234 567" />
        </Field>
        <Field label="Email" id="contactEmail">
          <Input id="contactEmail" type="email" value={data.contactEmail ?? ""} onChange={set("contactEmail")} placeholder="info@heoquay.com" />
        </Field>
        <Field label="Địa chỉ" id="contactAddress">
          <Input id="contactAddress" value={data.contactAddress ?? ""} onChange={set("contactAddress")} placeholder="47 Đường Ẩm Thực, Quận 1, TP.HCM" />
        </Field>
        <Field label="Giờ mở cửa" id="businessHours">
          <Input id="businessHours" value={data.businessHours ?? ""} onChange={set("businessHours")} placeholder="06:00 – 20:00, tất cả các ngày" />
        </Field>
      </Section>

      <Section title="Mạng xã hội">
        <Field label="Facebook" id="socialFacebook">
          <Input id="socialFacebook" value={data.socialFacebook ?? ""} onChange={set("socialFacebook")} placeholder="https://facebook.com/..." />
        </Field>
        <Field label="Instagram" id="socialInstagram">
          <Input id="socialInstagram" value={data.socialInstagram ?? ""} onChange={set("socialInstagram")} placeholder="https://instagram.com/..." />
        </Field>
        <Field label="YouTube" id="socialYoutube">
          <Input id="socialYoutube" value={data.socialYoutube ?? ""} onChange={set("socialYoutube")} placeholder="https://youtube.com/..." />
        </Field>
      </Section>

      <Section title="Phân tích & SEO">
        <Field label="Google Search Console — Verification Code" id="googleVerification">
          <Input
            id="googleVerification"
            value={data.googleVerification ?? ""}
            onChange={set("googleVerification")}
            placeholder="Dán giá trị content= ở đây (không cần cả thẻ meta)"
          />
          <p className="text-xs text-muted-foreground">
            Ví dụ: <code className="bg-muted px-1 rounded">AbCdEf1234567890</code> — lấy từ Google Search Console → Xác minh quyền sở hữu → Thẻ HTML
          </p>
        </Field>

        <Field label="Tracking Code (FB Pixel, Google Analytics, GTM...)" id="trackingCode">
          <Textarea
            id="trackingCode"
            value={data.trackingCode ?? ""}
            onChange={(e) => setData((prev) => ({ ...prev, trackingCode: e.target.value }))}
            placeholder={"<!-- Dán toàn bộ code từ Facebook Pixel / Google Analytics / GTM vào đây -->\n<script>\n  ...\n</script>"}
            className="font-mono text-xs min-h-[180px] resize-y"
          />
          <p className="text-xs text-muted-foreground">
            Paste nguyên code block từ FB / Google — hệ thống tự inject vào đúng vị trí.
          </p>
        </Field>
      </Section>

      <Button type="submit" disabled={saving}>
        {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Lưu cấu hình
      </Button>
    </form>
  )
}
