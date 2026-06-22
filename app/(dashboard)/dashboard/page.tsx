import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEditor } from "@/lib/permissions"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const canCreate = isEditor((user as any).role)

  const [posts, allCategories] = await Promise.all([
    db.post.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        title: true,
        published: true,
        featured: true,
        createdAt: true,
        image: true,
        likes: true,
        categories: {
          select: { category: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Quản lý bài viết của bạn.">
        {canCreate && <PostCreateButton />}
      </DashboardHeader>
      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} allCategories={allCategories} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>Chưa có bài viết</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {canCreate
                ? "Bạn chưa có bài viết nào. Bắt đầu tạo nội dung."
                : "Chưa có bài viết nào được phân công cho bạn."}
            </EmptyPlaceholder.Description>
            {canCreate && <PostCreateButton variant="outline" />}
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
