import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { UserList } from "@/components/admin/user-list"
import { UserCreateButton } from "@/components/admin/user-create-button"
import { DashboardPagination } from "@/components/admin/dashboard-pagination"

export const metadata = { title: "Users" }

const PAGE_SIZE = 20

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect("/dashboard")

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)

  const [total, users] = await Promise.all([
    db.user.count(),
    db.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { Post: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <DashboardShell>
      <DashboardHeader heading="Người dùng" text={`${total} tài khoản.`}>
        <UserCreateButton />
      </DashboardHeader>
      <UserList users={users} />
      <DashboardPagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/users"
      />
    </DashboardShell>
  )
}
