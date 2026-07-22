export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { ProfileForm } from "@/components/profile-form"

export const metadata = { title: "Tài khoản của tôi" }

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  })

  if (!dbUser) redirect("/login")

  const postCount = await db.post.count({ where: { authorId: dbUser.id } })

  const roleLabel =
    dbUser.role === "ADMIN" ? "Quản trị viên" :
    dbUser.role === "EDITOR" ? "Biên tập viên" : "Thành viên"

  const roleColor =
    dbUser.role === "ADMIN"
      ? "bg-red-500/20 text-red-300 border-red-500/30"
      : dbUser.role === "EDITOR"
      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
      : "bg-white/20 text-white/80 border-white/20"

  const memberSince = new Date(dbUser.createdAt).toLocaleDateString("vi-VN", {
    month: "long", year: "numeric",
  })

  const initial = dbUser.name?.[0]?.toUpperCase() ?? "?"

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/shop/heo-quay-lo-1.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-black/80" />
        </div>

        <div className="relative z-10 px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-orange-400/40 blur-xl scale-110" />
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl ring-4 ring-white/10">
              {dbUser.image ? (
                <img src={dbUser.image} alt={dbUser.name ?? ""} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-white text-3xl font-bold">
                  {initial}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">
              {dbUser.name ?? "Chưa đặt tên"}
            </h1>
            <p className="text-white/60 text-sm mt-0.5">{dbUser.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${roleColor}`}>
                {roleLabel}
              </span>
              <span className="text-white/50 text-xs">· Thành viên từ {memberSince}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">{postCount}</p>
              <p className="text-xs text-white/50 mt-0.5">Bài viết</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">🔥</p>
              <p className="text-xs text-white/50 mt-0.5">Đang hoạt động</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Form */}
        <div className="lg:col-span-3">
          <ProfileForm user={{ id: dbUser.id, name: dbUser.name ?? "", email: dbUser.email ?? "", image: dbUser.image ?? "" }} />
        </div>

        {/* Right card */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-4">
          {/* Welcome */}
          <div className="rounded-2xl overflow-hidden border shadow-sm bg-card">
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src="/images/shop/heo-quay-khay-1.jpg"
                alt="Heo quay"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Heo Quay Bình Tân</p>
                <p className="font-bold text-base leading-tight">Giòn thơm từng miếng 🍖</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <p className="font-bold text-base">
                Chào, {dbUser.name?.split(" ").pop() ?? "bạn"}! 👋
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cập nhật thông tin để chúng tôi phục vụ bạn tốt hơn. Cảm ơn bạn đã là một phần của gia đình Heo Quay Bình Tân.
              </p>
            </div>
          </div>

          {/* Tip */}
          <div
            className="rounded-2xl p-4 text-sm text-white/90 leading-relaxed"
            style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}
          >
            🐷 Mỗi bài viết của bạn giúp lan tỏa hương vị heo quay đến nhiều người hơn. Cảm ơn bạn!
          </div>
        </div>

      </div>
    </div>
  )
}
