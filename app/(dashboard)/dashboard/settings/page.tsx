import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { SiteConfigForm, type SiteConfigData } from "@/components/admin/site-config-form"

export const metadata = {
  title: "Settings",
  description: "Cấu hình site.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (user.role !== "ADMIN") redirect("/dashboard")

  const config = await db.siteConfig.findUnique({ where: { id: "default" } })
  const data = (config?.data ?? {}) as SiteConfigData

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Cài đặt"
        text="Cấu hình thông tin và nội dung hiển thị trên site."
      />
      <SiteConfigForm initial={data} />
    </DashboardShell>
  )
}
