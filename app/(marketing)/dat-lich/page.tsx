import Image from "next/image"
import { db } from "@/lib/db"
import { BookingForm } from "./booking-form"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const title = cfg.datLichTitle?.trim() || "Đặt lịch giao hàng"
  const description = `${title} — ${siteName}. Giao tận nơi đúng giờ.`
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      locale: "vi_VN",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
  }
}

const DEFAULT_HIGHLIGHTS = [
  { icon: "🚗", text: "Giao tận nơi đúng giờ" },
  { icon: "📞", text: "Chúng tôi sẽ liên hệ xác nhận sớm nhất" },
  { icon: "🐷", text: "Heo quay, vịt quay, gà quay" },
  { icon: "📅", text: "Đặt trước ít nhất 1 ngày" },
]
const HIGHLIGHT_ICONS = ["🚗", "📞", "🐷", "📅"]

export default async function DatLichPage() {
  const [dishes, siteConfigRow] = await Promise.all([
    db.dish.findMany({
      where: { available: true },
      select: { id: true, name: true, unit: true, image: true },
      orderBy: [{ group: { order: "asc" } }, { order: "asc" }],
    }),
    db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null),
  ])

  const products = dishes.map((d) => ({
    id: d.id,
    title: d.name,
    unit: d.unit,
    image: d.image ? { url: d.image } : null,
  }))

  const data = (siteConfigRow?.data ?? {}) as Record<string, string>
  const heroImage = data.datLichImage?.trim() || data.heroImage?.trim() || null
  const siteName = data.siteName?.trim() || "Heo Quay Bình Tân"
  const contactPhone = data.contactPhone?.trim() || null

  const datLichTitle = data.datLichTitle?.trim() || "Đặt Lịch Giao Hàng"
  const datLichSubtitle = data.datLichSubtitle?.trim() || "Giao hàng tận nơi"
  const datLichSectionLabel = data.datLichSectionLabel?.trim() || "Cam kết của chúng tôi"
  const datLichFormDesc = data.datLichFormDesc?.trim() || "Điền form bên dưới, chúng tôi sẽ liên hệ xác nhận sớm nhất."

  const highlights = [1, 2, 3, 4].map((n, i) => ({
    icon: HIGHLIGHT_ICONS[i],
    text: (data as any)[`datLichHighlight${n}`]?.trim() || DEFAULT_HIGHLIGHTS[i].text,
  }))

  return (
    <div className="min-h-screen">
      <div className="container px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Cột trái: ảnh + info ─────────────────────────── */}
          <div className="lg:sticky lg:top-20 space-y-6">
            {/* Ảnh */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-lg">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={siteName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <span className="text-7xl">🐷</span>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-1">{datLichSubtitle}</p>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {datLichTitle}
                </h1>
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-xl border bg-card p-5 space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{datLichSectionLabel}</p>
              <ul className="space-y-2.5">
                {highlights.map((h) => (
                  <li key={h.text} className="flex items-center gap-3 text-sm">
                    <span className="text-xl w-7 text-center flex-shrink-0">{h.icon}</span>
                    <span>{h.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hotline */}
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 hover:bg-primary/10 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.31 7.31l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hoặc gọi trực tiếp</p>
                  <p className="font-bold text-primary text-base">{contactPhone}</p>
                </div>
              </a>
            )}
          </div>

          {/* ── Cột phải: form ──────────────────────────────── */}
          <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="font-heading text-xl font-semibold">Thông tin đặt hàng</h2>
              <p className="text-sm text-muted-foreground mt-1">{datLichFormDesc}</p>
            </div>
            <BookingForm products={products} contactPhone={contactPhone} />
          </div>

        </div>
      </div>
    </div>
  )
}
