import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { BLUR_PLACEHOLDER } from "@/lib/image"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Thực đơn",
  description: "Xem thực đơn heo quay, vịt quay, gà quay tại Heo Quay Bình Tân.",
}

export default async function ThucDonPage() {
  const [groups, siteConfigRow] = await Promise.all([
    db.dishGroup.findMany({
      orderBy: { order: "asc" },
      include: { dishes: { orderBy: { order: "asc" }, include: { post: { select: { id: true } } } } },
    }),
    db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null),
  ])

  const cfg = (siteConfigRow?.data ?? {}) as Record<string, string>
  const heroImage = cfg.heroImage?.trim() || null
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const contactPhone = cfg.contactPhone?.trim() || null

  const visibleGroups = groups.filter((g) => g.dishes.length > 0)

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden bg-gradient-to-br from-primary/20 to-orange-100">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={siteName}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl opacity-20">🐷</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container px-4 sm:px-6 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-2">{siteName}</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Thực đơn
          </h1>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-10 lg:py-14 max-w-4xl">
        {/* ── Sticky category nav ───────────────────────────── */}
        {visibleGroups.length > 1 && (
          <div className="sticky top-16 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/95 backdrop-blur border-b mb-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {visibleGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {g.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Groups ───────────────────────────────────────── */}
        {visibleGroups.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <span className="text-5xl block mb-4">🍽️</span>
            Đang cập nhật thực đơn...
          </div>
        ) : (
          <div className="space-y-12">
            {visibleGroups.map((group) => (
              <section key={group.id} id={`group-${group.id}`} className="scroll-mt-32">
                {/* Group heading */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-7 rounded-full bg-primary shrink-0" />
                  <h2 className="font-heading text-xl sm:text-2xl font-bold">{group.name}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground shrink-0">{group.dishes.length} món</span>
                </div>

                {/* Dish list */}
                <div className="rounded-2xl border overflow-hidden shadow-sm">
                  {group.dishes.map((dish, i) => (
                    <div
                      key={dish.id}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 transition-colors",
                        i !== 0 && "border-t",
                        dish.available
                          ? "hover:bg-muted/40"
                          : "opacity-50 bg-muted/20"
                      )}
                    >
                      {/* Ảnh món (nếu có) */}
                      {dish.image && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            placeholder="blur"
                            blurDataURL={BLUR_PLACEHOLDER}
                          />
                        </div>
                      )}

                      {/* Tên + mô tả */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-sm sm:text-base">{dish.name}</p>
                          {!dish.available && (
                            <span className="text-[10px] font-bold uppercase tracking-wide bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              Hết
                            </span>
                          )}
                        </div>
                        {dish.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{dish.description}</p>
                        )}
                        {dish.post && (
                          <Link href={`/posts/${dish.post.id}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1 hover:underline">
                            Xem bài viết
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </Link>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/15 p-8 sm:p-10 text-center">
          <span className="text-4xl block mb-4">🛵</span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">Muốn đặt hàng?</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Liên hệ trực tiếp để được tư vấn và báo giá tốt nhất cho sự kiện của bạn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                📞 {contactPhone}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
