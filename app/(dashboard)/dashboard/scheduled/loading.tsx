import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonRow } from "@/components/admin/loading-skeleton"

export default function ScheduledLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Lên lịch đăng bài" text="Đang tải..." />
      <div className="rounded-md border divide-y overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} right={<Skeleton className="h-8 w-24 rounded-md" />} />
        ))}
      </div>
    </DashboardShell>
  )
}
