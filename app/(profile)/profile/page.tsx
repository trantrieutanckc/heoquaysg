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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Tài khoản của tôi</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

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
              {dbUser.role === "ADMIN" ? "Quản trị viên" : dbUser.role === "EDITOR" ? "Biên tập viên" : "Thành viên"}
            </span>
            <span className="text-xs text-muted-foreground">· {postCount} bài viết</span>
          </div>
        </div>
      </div>

      <ProfileForm user={{ id: dbUser.id, name: dbUser.name ?? "", email: dbUser.email ?? "", image: dbUser.image ?? "" }} />
    </div>
  )
}
