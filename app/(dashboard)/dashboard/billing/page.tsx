import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Billing",
}

export default function BillingPage() {
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
