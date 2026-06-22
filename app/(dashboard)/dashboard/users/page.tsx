import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserList } from "@/components/user-list"
import { UserCreateButton } from "@/components/user-create-button"

export const metadata = { title: "Users" }

export default async function UsersPage() {
  const users = await db.user.findMany({
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
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Users" text="Quản lý tài khoản và phân quyền vai trò.">
        <UserCreateButton />
      </DashboardHeader>
      <UserList users={users} />
    </DashboardShell>
  )
}
