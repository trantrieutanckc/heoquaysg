import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function ScheduledLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Lên lịch đăng bài" text="Đang tải..." />
      <div className="rounded-md border divide-y overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
