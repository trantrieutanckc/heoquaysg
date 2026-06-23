import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenuLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Menu" text="Quản lý điều hướng hiển thị trên website.">
        <Skeleton className="h-9 w-28" />
      </DashboardHeader>
      <div className="divide-y divide-border rounded-md border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-20 rounded-full hidden sm:block" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
