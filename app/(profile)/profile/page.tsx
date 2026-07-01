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

  const memberSince = new Date(dbUser.createdAt).toLocaleDateString("vi-VN", {
    month: "long", year: "numeric",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Tài khoản của tôi</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* Cột trái — Profile */}
        <div className="lg:col-span-3 space-y-6">
          {/* Avatar + info */}
          <div className="flex items-center gap-5 p-6 rounded-2xl border bg-card">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-muted shrink-0 ring-4 ring-border">
              {dbUser.image ? (
                <img src={dbUser.image} alt={dbUser.name ?? ""} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                  {dbUser.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-xl">{dbUser.name ?? "Chưa đặt tên"}</p>
              <p className="text-sm text-muted-foreground">{dbUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  dbUser.role === "ADMIN"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : dbUser.role === "EDITOR"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {roleLabel}
                </span>
                <span className="text-xs text-muted-foreground">· {postCount} bài viết</span>
              </div>
            </div>
          </div>

          <ProfileForm user={{ id: dbUser.id, name: dbUser.name ?? "", email: dbUser.email ?? "", image: dbUser.image ?? "" }} />
        </div>

        {/* Cột phải — Welcome card */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <div className="rounded-2xl overflow-hidden border shadow-sm">
            {/* Ảnh heo quay */}
            <div className="relative h-52 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
                alt="Heo quay"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs font-medium uppercase tracking-widest opacity-80">Heo Quay Bình Tân</p>
                <p className="font-heading text-xl font-bold">Giòn thơm từng miếng</p>
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-6 bg-card space-y-4">
              <div>
                <h2 className="font-heading text-lg font-bold">
                  Chào mừng, {dbUser.name?.split(" ").pop() ?? "bạn"}! 👋
                </h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Cảm ơn bạn đã là một phần của gia đình Heo Quay Bình Tân. Hãy cập nhật thông tin để chúng tôi phục vụ bạn tốt hơn nhé.
                </p>
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-heading font-bold text-primary">{postCount}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bài viết</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{memberSince}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Thành viên từ</p>
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                🐷 Mỗi bài viết của bạn giúp lan tỏa hương vị heo quay đến nhiều người hơn. Cảm ơn bạn!
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
