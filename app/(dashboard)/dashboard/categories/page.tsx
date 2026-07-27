import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { CategoryList } from "@/components/admin/category-list"
import { CategoryCreateButton } from "@/components/admin/category-create-button"
import { DashboardPagination } from "@/components/admin/dashboard-pagination"
import { DashboardSearchInput } from "@/components/admin/dashboard-search-input"

export const metadata = { title: "Danh mục" }

const PAGE_SIZE = 20

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string }
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)
  const q = searchParams.q?.trim() ?? ""

  const where = q ? { name: { contains: q } } : {}

  const [total, categories] = await Promise.all([
    db.category.count({ where }),
    db.category.findMany({
      where,
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, slug: true, description: true, published: true, order: true, image: true, template: true, banner: true,
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
      <DashboardHeader
        heading="Danh mục"
        text={q ? `${total} kết quả cho "${q}"` : `${total} danh mục.`}
      >
        <div className="flex items-center gap-2">
          <DashboardSearchInput placeholder="Tìm tên danh mục..." />
          <CategoryCreateButton />
        </div>
      </DashboardHeader>
      <CategoryList categories={categories} />
      <DashboardPagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/categories"
        extraParams={q ? { q } : undefined}
      />
    </DashboardShell>
  )
}
