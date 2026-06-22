import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { MenuList } from "@/components/menu-list"
import { MenuCreateButton } from "@/components/menu-create-button"

export const metadata = { title: "Menu" }

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    db.menuItem.findMany({
      orderBy: { order: "asc" },
      include: { category: { select: { id: true, name: true, slug: true } } },
    }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } }),
  ])

  return (
    <DashboardShell>
      <DashboardHeader heading="Menu" text="Quản lý điều hướng hiển thị trên website.">
        <MenuCreateButton categories={categories} />
      </DashboardHeader>
      <MenuList items={items} categories={categories} />
    </DashboardShell>
  )
}
