import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { PostCreateButton } from "@/components/admin/post-create-button"

export default function PostsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Bài viết" text="Danh sách bài viết của bạn.">
        <PostCreateButton />
      </DashboardHeader>
      <div className="divide-y divide-border rounded-md border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
