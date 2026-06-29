import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { HomepageAppearanceForm } from "@/components/admin/homepage-appearance-form"
import type { SiteConfigData } from "@/components/admin/site-config-form"

export const metadata = { title: "Giao diện Homepage" }

export default async function HomepageAppearancePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if ((user as any).role !== "ADMIN") redirect("/dashboard")

  const config = await db.siteConfig.findUnique({ where: { id: "default" } })
  const data = (config?.data ?? {}) as SiteConfigData

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Giao diện Homepage"
        text="Tùy chỉnh màu nền hoặc ảnh nền cho từng section trên trang chủ."
      />
      <HomepageAppearanceForm initialData={data} />
    </DashboardShell>
  )
}
