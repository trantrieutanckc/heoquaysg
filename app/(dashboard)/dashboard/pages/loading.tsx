import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function PagesLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Trang tĩnh" text="Đang tải..." />
      <div className="divide-y divide-border rounded-md border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
