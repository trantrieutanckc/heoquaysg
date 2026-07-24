export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { ContactClient } from "./contact-client"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const description = `Liên hệ với ${siteName} — đặt hàng, tư vấn thực đơn hoặc gửi góp ý.`
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title: "Liên hệ",
    description,
    openGraph: {
      title: `Liên hệ | ${siteName}`,
      description,
      locale: "vi_VN",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `Liên hệ | ${siteName}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function ContactPage() {
  const config = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (config?.data ?? {}) as Record<string, string>

  return (
    <ContactClient
      siteName={cfg.siteName?.trim() || "Heo Quay Bình Tân"}
      contactPhone={cfg.contactPhone?.trim()}
      contactEmail={cfg.contactEmail?.trim()}
      contactAddress={cfg.contactAddress?.trim()}
      contactZalo={cfg.contactZalo?.trim()}
      contactIntro={cfg.contactIntro?.trim()}
      heroImage={cfg.heroImage?.trim()}
    />
  )
}
