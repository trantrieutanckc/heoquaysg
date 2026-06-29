import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function AboutEditorLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Về chúng tôi" text="Đang tải..." />
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-[100px] w-full rounded-md" />
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
