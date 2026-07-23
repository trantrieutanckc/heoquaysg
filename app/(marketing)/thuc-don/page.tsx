import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { postUrl } from "@/lib/post-url"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const subtitle = cfg.thucDonSubtitle?.trim() || "Heo quay · Vịt quay · Gà quay & đặc sản"
  const description = `Xem thực đơn ${subtitle} tại ${siteName}.`
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title: "Thực đơn",
    description,
    openGraph: {
      title: `Thực đơn | ${siteName}`,
      description,
      locale: "vi_VN",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
  }
}

export default async function ThucDonPage() {
  const [groups, siteConfigRow] = await Promise.all([
    db.dishGroup.findMany({
      orderBy: { order: "asc" },
      include: { dishes: { orderBy: { order: "asc" }, include: { post: { select: { id: true, slug: true } } } } },
    }),
    db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null),
  ])

  const cfg = (siteConfigRow?.data ?? {}) as Record<string, string>
  const useSlugs = cfg.useSlugs === "true"
  const heroImage = cfg.thucDonImage?.trim() || cfg.heroImage?.trim() || "/images/shop/heo-quay-khay-1.jpg"
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const contactPhone = cfg.contactPhone?.trim() || null
  const thucDonSubtitle = cfg.thucDonSubtitle?.trim() || "Heo quay · Vịt quay · Gà quay & đặc sản"

  const visibleGroups = groups.filter((g) => g.dishes.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 lg:h-[420px] overflow-hidden">
        <Image
          src={heroImage}
          alt={siteName}
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/50 via-transparent to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />

        <div className="absolute bottom-0 left-0 right-0 container px-4 sm:px-6 pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-300/90 mb-2">✦ {siteName}</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-xl">
            Thực đơn
          </h1>
          <p className="text-white/55 text-sm mt-2 tracking-wide">{thucDonSubtitle}</p>
          {visibleGroups.length > 0 && (
            <div className="flex items-center gap-1.5 mt-5">
              <div className="h-0.5 w-8 bg-orange-400/60 rounded-full" />
              <span className="text-xs text-white/40">{visibleGroups.reduce((s, g) => s + g.dishes.length, 0)} món</span>
            </div>
          )}
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-10 lg:py-14 max-w-5xl">
        {/* Sticky category nav */}
        {visibleGroups.length > 1 && (
          <div className="sticky top-16 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-orange-100 dark:border-orange-950/40 mb-10">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {visibleGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-700 dark:hover:border-orange-700 dark:hover:text-white transition-all duration-200"
                >
                  {g.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Groups */}
        {visibleGroups.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <span className="text-5xl block mb-4">🍽️</span>
            Đang cập nhật thực đơn...
          </div>
        ) : (
          <div className="space-y-16">
            {visibleGroups.map((group) => (
              <section key={group.id} id={`group-${group.id}`} className="scroll-mt-32">
                {/* Group heading */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="shrink-0 flex items-center gap-1">
                    <div className="w-1.5 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, #f97316, #dc2626)" }} />
                    <div className="w-0.5 h-6 rounded-full bg-orange-200 dark:bg-orange-900" />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold">{group.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 via-orange-100 to-transparent dark:from-orange-900 dark:via-orange-950" />
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold shrink-0 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 px-2.5 py-1 rounded-full">
                    {group.dishes.length} món
                  </span>
                </div>

                {/* Dish grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {group.dishes.map((dish) => {
                    const Wrapper = dish.post ? Link : "div"
                    const wrapperProps = dish.post ? { href: postUrl(dish.post, useSlugs) } : {}
                    return (
                    <Wrapper
                      key={dish.id}
                      {...(wrapperProps as any)}
                      className={cn(
                        "group relative flex overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 aspect-[3/4]",
                        !dish.available && "opacity-55"
                      )}
                    >
                      {dish.image ? (
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl"
                          style={{ background: "linear-gradient(135deg, #fff7ed, #fed7aa, #fdba74)" }}
                        >
                          🐷
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {!dish.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full">Hết món</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-heading font-bold text-sm leading-tight line-clamp-2">{dish.name}</p>
                        {dish.price != null && (
                          <p className="text-orange-300 text-xs font-bold mt-0.5">{dish.price.toLocaleString("vi-VN")}đ</p>
                        )}
                      </div>
                      {dish.post && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                      )}
                    </Wrapper>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl overflow-hidden shadow-xl">
          <div className="relative p-8 sm:p-12 text-center text-white"
            style={{ background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #dc2626 80%, #9f1239 100%)" }}
          >
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
            <div className="absolute top-4 right-6 text-6xl opacity-10 select-none">🐷</div>
            <div className="relative z-10">
              <span className="text-4xl block mb-4">🛵</span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-2">Muốn đặt hàng?</h3>
              <p className="text-white/65 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
                Liên hệ trực tiếp để được tư vấn và báo giá tốt nhất cho sự kiện của bạn.
              </p>
              {contactPhone && (
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 bg-white text-orange-700 font-bold px-8 py-3.5 rounded-full text-sm hover:bg-orange-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  📞 {contactPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
