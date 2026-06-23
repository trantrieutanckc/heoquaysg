import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = { title: "Billing" }

export default async function BillingPage() {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") redirect("/dashboard")
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Tính năng thanh toán chưa được kích hoạt."
      />
      <p className="text-muted-foreground">Chức năng này đang được phát triển.</p>
    </DashboardShell>
  )
}
