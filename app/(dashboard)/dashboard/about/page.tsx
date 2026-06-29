import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { AboutEditorForm } from "@/components/about-editor-form"
import type { SiteConfigData } from "@/components/site-config-form"

export const metadata = { title: "Về chúng tôi" }

export default async function AboutEditorPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if ((user as any).role !== "ADMIN") redirect("/dashboard")

  const config = await db.siteConfig.findUnique({ where: { id: "default" } })
  const data = (config?.data ?? {}) as SiteConfigData

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Về chúng tôi"
        text="Chỉnh nội dung trang /about. Để trống → hiển thị nội dung mặc định."
      />
      <AboutEditorForm initial={data} />
    </DashboardShell>
  )
}
