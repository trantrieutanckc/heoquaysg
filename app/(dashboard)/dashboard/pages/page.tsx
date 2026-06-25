import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { PageList } from "@/components/page-list"
import { PageCreateButton } from "@/components/page-create-button"

export const metadata = { title: "Trang tĩnh" }

export default async function PagesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const pages = await db.page.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      updatedAt: true,
    },
  })

  const serialized = pages.map((p) => ({
    ...p,
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <DashboardShell>
      <DashboardHeader heading="Trang tĩnh" text={`${pages.length} trang`}>
        <PageCreateButton />
      </DashboardHeader>
      <PageList pages={serialized} />
    </DashboardShell>
  )
}
