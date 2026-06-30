import { db } from "@/lib/db"

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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
