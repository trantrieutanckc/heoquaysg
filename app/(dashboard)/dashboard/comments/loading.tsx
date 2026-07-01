import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function CommentsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Bình luận" text="Đang tải..." />
      <div className="divide-y divide-border rounded-md border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-4 w-3/4 ml-9" />
            <Skeleton className="h-3 w-40 ml-9" />
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
