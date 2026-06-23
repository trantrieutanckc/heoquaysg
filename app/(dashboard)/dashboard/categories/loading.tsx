import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Categories" text="Quản lý danh mục bài viết.">
        <Skeleton className="h-9 w-32" />
      </DashboardHeader>
      <div className="divide-y divide-border rounded-md border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-16 hidden sm:block" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
