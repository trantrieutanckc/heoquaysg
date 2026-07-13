import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { PostCreateButton } from "@/components/admin/post-create-button"
import { SkeletonRow } from "@/components/admin/loading-skeleton"

export default function PostsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Bài viết" text="Danh sách bài viết của bạn.">
        <PostCreateButton />
      </DashboardHeader>
      <div className="divide-y divide-border rounded-md border">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    </DashboardShell>
  )
}
