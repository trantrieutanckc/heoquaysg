import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Skeleton } from "@/components/ui/skeleton"

function SectionSkeleton({ fields }: { fields: number }) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <Skeleton className="h-5 w-36" />
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="grid gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  )
}

export default function SettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Cấu hình thông tin và nội dung hiển thị trên site."
      />
      <div className="space-y-6">
        <SectionSkeleton fields={4} />
        <SectionSkeleton fields={4} />
        <SectionSkeleton fields={3} />
        <div className="rounded-2xl border bg-card p-6 space-y-5">
          <Skeleton className="h-5 w-36" />
          <div className="grid gap-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="grid gap-1.5">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-44 w-full rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </DashboardShell>
  )
}
