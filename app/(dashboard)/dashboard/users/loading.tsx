import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function UsersLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Users" text="Quản lý tài khoản và phân quyền vai trò.">
        <Skeleton className="h-9 w-24" />
      </DashboardHeader>
      <div className="divide-y divide-border rounded-md border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-16 hidden sm:block" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
