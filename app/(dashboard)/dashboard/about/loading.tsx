import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "@/components/admin/loading-skeleton"

export default function AboutEditorLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Về chúng tôi" text="Đang tải..." />
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i}>
            <Skeleton className="h-[100px] w-full rounded-md" />
          </SkeletonCard>
        ))}
      </div>
    </DashboardShell>
  )
}
