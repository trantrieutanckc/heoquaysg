import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ContactEditorForm } from "@/components/contact-editor-form"
import type { SiteConfigData } from "@/components/site-config-form"

export const metadata = { title: "Liên hệ" }

export default async function ContactEditorPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if ((user as any).role !== "ADMIN") redirect("/dashboard")

  const config = await db.siteConfig.findUnique({ where: { id: "default" } })
  const data = (config?.data ?? {}) as SiteConfigData

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Liên hệ"
        text="Chỉnh nội dung trang /lien-he. Để trống → hiển thị nội dung mặc định."
      />
      <ContactEditorForm initial={data} />
    </DashboardShell>
  )
}
