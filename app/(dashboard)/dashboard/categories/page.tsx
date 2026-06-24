import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { CategoryList } from "@/components/category-list"
import { CategoryCreateButton } from "@/components/category-create-button"
import { DashboardPagination } from "@/components/dashboard-pagination"

export const metadata = { title: "Danh mục" }

const PAGE_SIZE = 20

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)

  const [total, categories] = await Promise.all([
    db.category.count(),
    db.category.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, slug: true, published: true, order: true, image: true, template: true, banner: true,
        seoTitle: true, seoDescription: true, seoKeywords: true, seoImage: true,
        _count: { select: { posts: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <DashboardShell>
      <DashboardHeader heading="Danh mục" text={`${total} danh mục.`}>
        <CategoryCreateButton />
      </DashboardHeader>
      <CategoryList categories={categories} />
      <DashboardPagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/categories"
      />
    </DashboardShell>
  )
}
