import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { CategoryList } from "@/components/category-list"
import { CategoryCreateButton } from "@/components/category-create-button"

export const metadata = { title: "Categories" }

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true, name: true, slug: true, published: true, order: true, image: true, template: true, banner: true,
      seoTitle: true, seoDescription: true, seoKeywords: true, seoImage: true,
      _count: { select: { posts: true } },
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Categories" text="Quản lý danh mục bài viết.">
        <CategoryCreateButton />
      </DashboardHeader>
      <CategoryList categories={categories} />
    </DashboardShell>
  )
}
