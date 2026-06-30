"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ProfileFormProps {
  user: { id: string; name: string; email: string; image: string }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [name, setName] = React.useState(user.name)
  const [image, setImage] = React.useState(user.image)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [savingInfo, setSavingInfo] = React.useState(false)
  const [savingPassword, setSavingPassword] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const avatarInputRef = React.useRef<HTMLInputElement>(null)

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    const form = new FormData()
    form.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: form })
    const data = await res.json()
    setUploading(false)
    if (!res.ok || data.error) {
      setUploadError(data.error ?? "Upload thất bại")
      return
    }
    setImage(data.url)
  }

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault()
    setSavingInfo(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: image || null }),
    })
    setSavingInfo(false)
    if (res.ok) {
      toast({ variant: "success", description: "Đã cập nhật thông tin." })
      router.refresh()
    } else {
      toast({ description: "Có lỗi xảy ra, vui lòng thử lại.", variant: "destructive" })
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({ description: "Mật khẩu xác nhận không khớp.", variant: "destructive" })
      return
    }
    if (newPassword.length < 8) {
      toast({ description: "Mật khẩu mới phải có ít nhất 8 ký tự.", variant: "destructive" })
      return
    }
    setSavingPassword(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    setSavingPassword(false)
    if (res.ok) {
      toast({ variant: "success", description: "Đã đổi mật khẩu thành công." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      const data = await res.json().catch(() => ({}))
      toast({ description: data.message ?? "Mật khẩu hiện tại không đúng.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Info form */}
      <form onSubmit={handleSaveInfo} className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="font-heading text-lg font-semibold">Thông tin cá nhân</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Tên hiển thị</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">Email không thể thay đổi.</p>
        </div>

        <div className="space-y-3">
          <Label>Ảnh đại diện</Label>
          <div className="flex items-center gap-5">
            {/* Circle preview */}
            <div className="h-20 w-20 rounded-full overflow-hidden bg-muted border-2 border-border shrink-0">
              {image ? (
                <img src={image} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading
                    ? <Icons.spinner className="mr-1.5 h-4 w-4 animate-spin" />
                    : <Icons.media className="mr-1.5 h-4 w-4" />
                  }
                  {uploading ? "Đang tải..." : "Tải ảnh lên"}
                </Button>
                {image && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setImage("")}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="hoặc nhập URL ảnh..."
                className="text-sm"
              />
              {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            </div>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>

        <Button type="submit" disabled={savingInfo}>
          {savingInfo && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Lưu thay đổi
        </Button>
      </form>

      {/* Password form */}
      <form onSubmit={handleChangePassword} className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="font-heading text-lg font-semibold">Đổi mật khẩu</h2>

        <div className="space-y-2">
          <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">Mật khẩu mới</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" disabled={savingPassword || !currentPassword || !newPassword}>
          {savingPassword && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  )
}
