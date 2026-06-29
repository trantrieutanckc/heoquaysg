import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEditor } from "@/lib/permissions"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostList } from "@/components/post-list"
import { DashboardShell } from "@/components/shell"
import { DashboardPagination } from "@/components/dashboard-pagination"
import { PostsImportExport } from "@/components/posts-import-export"

export const metadata = { title: "Bài viết" }

const PAGE_SIZE = 6

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const user = await getCurrentUser()
  if (!user) redirect(authOptions?.pages?.signIn || "/login")

  const canCreate = isEditor((user as any).role)
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)
  const postWhere = { authorId: user.id }

  const [total, posts, allCategories] = await Promise.all([
    db.post.count({ where: postWhere }),
    db.post.findMany({
      where: postWhere,
      select: {
        id: true,
        title: true,
        published: true,
        featured: true,
        createdAt: true,
        image: true,
        likes: true,
        avgRating: true,
        ratingCount: true,
        categories: {
          select: { category: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <DashboardShell>
      <DashboardHeader heading="Bài viết" text={`${total} bài viết.`}>
        <div className="flex items-center gap-2">
          {canCreate && <PostsImportExport />}
          {canCreate && <PostCreateButton />}
        </div>
      </DashboardHeader>

      {posts?.length ? (
        <>
          <PostList posts={posts} allCategories={allCategories} />
          <DashboardPagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/dashboard/posts"
          />
        </>
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
    </DashboardShell>
  )
}
