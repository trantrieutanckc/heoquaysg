"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { ImageUploader } from "@/components/image-uploader"

type Role = "ADMIN" | "EDITOR" | "CONTRIBUTOR"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: Role
  createdAt: string
  _count: { Post: number }
}

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONTRIBUTOR: "Contributor",
}

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  EDITOR: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  CONTRIBUTOR: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
}

const ROLES: Role[] = ["ADMIN", "EDITOR", "CONTRIBUTOR"]

export function UserList({ users: initialUsers }: { users: User[] }) {
  const router = useRouter()
  const [users, setUsers] = React.useState(initialUsers)
  const [updating, setUpdating] = React.useState<string | null>(null)

  // Edit info dialog
  const [editUser, setEditUser] = React.useState<User | null>(null)
  const [editName, setEditName] = React.useState("")
  const [editEmail, setEditEmail] = React.useState("")
  const [savingEdit, setSavingEdit] = React.useState(false)

  // Password dialog
  const [pwdUserId, setPwdUserId] = React.useState<string | null>(null)
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [savingPwd, setSavingPwd] = React.useState(false)

  // Avatar dialog
  const [avatarUser, setAvatarUser] = React.useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = React.useState("")
  const [savingAvatar, setSavingAvatar] = React.useState(false)

  React.useEffect(() => { setUsers(initialUsers) }, [initialUsers])

  // ── Edit info ─────────────────────────────────────────
  function openEditDialog(user: User) {
    setEditUser(user)
    setEditName(user.name ?? "")
    setEditEmail(user.email ?? "")
  }

  async function handleEditSave() {
    if (!editUser || !editName.trim() || !editEmail.trim()) return
    setSavingEdit(true)
    const res = await fetch(`/api/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim(), email: editEmail.trim() }),
    })
    setSavingEdit(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      const msg = data?.[0]?.message ?? "Không thể cập nhật thông tin."
      return toast({ title: "Lỗi", description: msg, variant: "destructive" })
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editUser.id ? { ...u, name: editName.trim(), email: editEmail.trim() } : u
      )
    )
    toast({ description: "Đã cập nhật thông tin user." })
    setEditUser(null)
    router.refresh()
  }

  // ── Role ──────────────────────────────────────────────
  async function handleRoleChange(userId: string, role: Role) {
    setUpdating(userId)
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
    setUpdating(null)
    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể cập nhật vai trò.", variant: "destructive" })
    }
    toast({ description: "Đã cập nhật vai trò." })
    router.refresh()
  }

  // ── Password ──────────────────────────────────────────
  function openPasswordDialog(userId: string) {
    setPwdUserId(userId)
    setNewPassword("")
    setConfirmPassword("")
  }

  async function handlePasswordSave() {
    if (!pwdUserId || newPassword.length < 6 || newPassword !== confirmPassword) return
    setSavingPwd(true)
    const res = await fetch(`/api/users/${pwdUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
    setSavingPwd(false)
    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể đổi mật khẩu.", variant: "destructive" })
    }
    toast({ description: "Đã đổi mật khẩu thành công." })
    setPwdUserId(null)
  }

  // ── Avatar ────────────────────────────────────────────
  function openAvatarDialog(user: User) {
    setAvatarUser(user)
    setAvatarUrl(user.image ?? "")
  }

  async function handleAvatarSave() {
    if (!avatarUser) return
    setSavingAvatar(true)
    const res = await fetch(`/api/users/${avatarUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: avatarUrl || null }),
    })
    setSavingAvatar(false)
    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể cập nhật avatar.", variant: "destructive" })
    }
    setUsers((prev) =>
      prev.map((u) => u.id === avatarUser.id ? { ...u, image: avatarUrl || null } : u)
    )
    toast({ description: "Đã cập nhật avatar." })
    setAvatarUser(null)
    router.refresh()
  }

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">Chưa có user nào.</p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-border rounded-md border">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3">
              {/* Avatar — click to edit */}
              <button
                type="button"
                onClick={() => openAvatarDialog(user)}
                title="Đổi avatar"
                className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden group"
              >
                {user.image ? (
                  <img src={user.image} alt={user.name ?? ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icons.media className="h-3.5 w-3.5 text-white" />
                </span>
              </button>

              <div>
                <p className="font-medium leading-none">{user.name ?? "—"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {user._count.Post} bài viết
              </span>

              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>

              <select
                value={user.role}
                disabled={updating === user.id}
                onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm shadow-sm disabled:opacity-50"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(user)}
                title="Chỉnh sửa thông tin"
              >
                <Icons.edit className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openPasswordDialog(user.id)}
                title="Đổi mật khẩu"
              >
                <Icons.settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog chỉnh sửa tên & email */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Tên</Label>
              <Input
                id="edit-name"
                placeholder="Tên hiển thị"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@example.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditUser(null)}>Huỷ</Button>
            <Button
              onClick={handleEditSave}
              disabled={!editName.trim() || !editEmail.trim() || savingEdit}
            >
              {savingEdit && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog đổi avatar */}
      <Dialog open={!!avatarUser} onOpenChange={(open) => !open && setAvatarUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Avatar — {avatarUser?.name ?? avatarUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* Preview tròn */}
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center text-2xl font-semibold">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  avatarUser?.name?.[0]?.toUpperCase() ?? "?"
                )}
              </div>
            </div>

            <ImageUploader value={avatarUrl} onChange={setAvatarUrl} />

            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive w-fit"
                onClick={() => setAvatarUrl("")}
              >
                <Icons.trash className="mr-2 h-3.5 w-3.5" />
                Xóa avatar
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAvatarUser(null)}>Huỷ</Button>
            <Button onClick={handleAvatarSave} disabled={savingAvatar}>
              {savingAvatar && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog đổi mật khẩu */}
      <Dialog open={!!pwdUserId} onOpenChange={(open) => !open && setPwdUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">Mật khẩu không khớp</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPwdUserId(null)}>Huỷ</Button>
            <Button
              onClick={handlePasswordSave}
              disabled={newPassword.length < 6 || newPassword !== confirmPassword || savingPwd}
            >
              {savingPwd && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
