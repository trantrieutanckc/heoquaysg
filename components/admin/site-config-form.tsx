"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ImagePickerInput } from "@/components/admin/image-picker-input"
import { SaveOverlay } from "@/components/ui/save-overlay"

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
  contactIntro?: string
  socialFacebook?: string
  socialInstagram?: string
  socialYoutube?: string
  googleVerification?: string
  trackingCode?: string
  // About page
  aboutStory1?: string
  aboutStory2?: string
  aboutStat1Number?: string
  aboutStat1Label?: string
  aboutStat1Desc?: string
  aboutStat2Number?: string
  aboutStat2Label?: string
  aboutStat2Desc?: string
  aboutStat3Number?: string
  aboutStat3Label?: string
  aboutStat3Desc?: string
  aboutStep1Title?: string
  aboutStep1Desc?: string
  aboutStep2Title?: string
  aboutStep2Desc?: string
  aboutStep3Title?: string
  aboutStep3Desc?: string
  aboutStep4Title?: string
  aboutStep4Desc?: string
  aboutCommit1Title?: string
  aboutCommit1Desc?: string
  aboutCommit2Title?: string
  aboutCommit2Desc?: string
  aboutCommit3Title?: string
  aboutCommit3Desc?: string
  aboutCommit4Title?: string
  aboutCommit4Desc?: string
  // SEO robots
  robotsIndex?: string  // "true" = cho phép index, "false" = noindex
  robotsTxtContent?: string
  // Homepage section text
  homeFeaturedLabel?: string
  homeFeaturedTitle?: string
  homeCategoriesLabel?: string
  homeCategoriesTitle?: string
  homeAboutLabel?: string
  homePostsLabel?: string
  homePostsTitle?: string
  homeBookingLabel?: string
  homeBookingTitle?: string
  homeBookingDesc?: string
  // Rich content (TipTap JSON serialized)
  homeAboutContent?: string
  homeBookingContent?: string
  // Homepage section backgrounds
  homeFeaturedBgColor?: string
  homeFeaturedBgImage?: string
  homeCategoriesBgColor?: string
  homeCategoriesBgImage?: string
  homeAboutBgColor?: string
  homeAboutBgImage?: string
  homePostsBgColor?: string
  homePostsBgImage?: string
  homeBookingBgColor?: string
  homeBookingBgImage?: string
  homeMapBgColor?: string
  homeMapBgImage?: string
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
    if (res.ok) {
      toast({ variant: "success", description: "Đã lưu cấu hình." })
    } else {
      toast({ description: "Có lỗi xảy ra.", variant: "destructive" })
    }
  }

  return (
    <>
    <SaveOverlay visible={saving} />
    <form onSubmit={handleSave} className="space-y-6">
      <Section title="Thông tin site">
        <Field label="Tên site" id="siteName">
          <Input id="siteName" value={data.siteName ?? ""} onChange={set("siteName")} placeholder="Heo Quay Bình Tân" />
        </Field>
        <Field label="Tagline" id="siteTagline">
          <Input id="siteTagline" value={data.siteTagline ?? ""} onChange={set("siteTagline")} placeholder="Heo quay ngon nhất Bình Tân" />
        </Field>
        <Field label="Mô tả ngắn" id="siteDescription">
          <Input id="siteDescription" value={data.siteDescription ?? ""} onChange={set("siteDescription")} placeholder="Chuyên heo quay, bánh mì thịt..." />
        </Field>
        <Field label="Logo" id="logoUrl">
          <ImagePickerInput
            id="logoUrl"
            value={data.logoUrl ?? ""}
            onChange={(url) => setData((prev) => ({ ...prev, logoUrl: url }))}
            previewClass="h-16 w-16 rounded-full object-cover border"
            placeholder="https://..."
          />
        </Field>
        <Field label="Ảnh Hero Banner (trang chủ)" id="heroImage">
          <ImagePickerInput
            id="heroImage"
            value={data.heroImage ?? ""}
            onChange={(url) => setData((prev) => ({ ...prev, heroImage: url }))}
            previewClass="h-28 w-full max-w-sm rounded-lg object-cover border"
            placeholder="https://... (URL ảnh nền hero)"
          />
        </Field>
      </Section>

      <Section title="Phân tích & SEO">
        {/* Robots index toggle */}
        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">Cho phép Google index website</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tắt khi đang dev/test. Bật khi go live để Google tìm thấy website.
            </p>
            <p className="text-xs mt-1.5">
              Hiện tại:{" "}
              <span className={data.robotsIndex === "true" ? "text-green-600 font-semibold" : "text-orange-500 font-semibold"}>
                {data.robotsIndex === "true" ? "✓ Đang cho phép index" : "✗ Đang chặn index (noindex)"}
              </span>
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.robotsIndex === "true"}
            onClick={() => setData((prev) => ({ ...prev, robotsIndex: prev.robotsIndex === "true" ? "false" : "true" }))}
            className={[
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
              data.robotsIndex === "true" ? "bg-green-500" : "bg-muted-foreground/30",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
                data.robotsIndex === "true" ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>

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

        <Field label="Nội dung file robots.txt" id="robotsTxtContent">
          <Textarea
            id="robotsTxtContent"
            value={data.robotsTxtContent ?? ""}
            onChange={(e) => setData((prev) => ({ ...prev, robotsTxtContent: e.target.value }))}
            placeholder={`User-agent: *\nDisallow: /dashboard/\nDisallow: /api/\nAllow: /\n\nSitemap: https://your-domain.com/sitemap.xml`}
            className="font-mono text-xs min-h-[160px] resize-y"
          />
          <p className="text-xs text-muted-foreground">
            Để trống sẽ dùng nội dung mặc định. Xem trực tiếp tại{" "}
            <a href="/robots.txt" target="_blank" className="underline hover:text-foreground">/robots.txt</a>
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
        Lưu cấu hình
      </Button>
    </form>
    </>
  )
}
