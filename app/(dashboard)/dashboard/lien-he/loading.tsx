import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "@/components/admin/loading-skeleton"

export default function ContactEditorLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Liên hệ" text="Đang tải..." />
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} titleWidth="w-28">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </SkeletonCard>
        ))}
      </div>
    </DashboardShell>
  )
}
