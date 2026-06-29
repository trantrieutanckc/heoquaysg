import { CardSkeleton } from "@/components/admin/card-skeleton"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"

export default function DashboardBillingLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
