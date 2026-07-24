"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ImageUploader } from "@/components/admin/image-uploader"
import { DishesImportExport } from "@/components/admin/dishes-import-export"

interface Dish {
  id: string
  name: string
  description: string | null
  unit: string
  image: string | null
  postId: string | null
  available: boolean
  order: number
}

interface PostOption {
  id: string
  title: string
}

interface DishGroup {
  id: string
  name: string
  order: number
  dishes: Dish[]
}

export default function ThucDonPage() {
  const [groups, setGroups] = React.useState<DishGroup[]>([])
  const [posts, setPosts] = React.useState<PostOption[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newGroupName, setNewGroupName] = React.useState("")
  const [addingGroup, setAddingGroup] = React.useState(false)
  const [editGroupId, setEditGroupId] = React.useState<string | null>(null)
  const [editGroupName, setEditGroupName] = React.useState("")

  const [addingDishFor, setAddingDishFor] = React.useState<string | null>(null)
  const [newDish, setNewDish] = React.useState({ name: "", unit: "phần", description: "", image: "", postId: "" })

  const [editDishId, setEditDishId] = React.useState<string | null>(null)
  const [editDish, setEditDish] = React.useState({ name: "", unit: "", description: "", image: "", postId: "" })

  async function load() {
    const [groupsRes, postsRes] = await Promise.all([
      fetch("/api/dish-groups"),
      fetch("/api/posts"),
    ])
    setGroups(await groupsRes.json())
    const postsData = await postsRes.json()
    setPosts(Array.isArray(postsData) ? postsData : (postsData.posts ?? []))
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  async function addGroup() {
    if (!newGroupName.trim()) return
    const res = await fetch("/api/dish-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newGroupName.trim() }),
    })
    if (res.ok) {
      setNewGroupName("")
      setAddingGroup(false)
      load()
      toast({ description: "Đã thêm nhóm món." })
    }
  }

  async function updateGroup(id: string) {
    await fetch(`/api/dish-groups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editGroupName }),
    })
    setEditGroupId(null)
    load()
  }

  async function deleteGroup(id: string) {
    if (!confirm("Xóa nhóm này sẽ xóa toàn bộ món bên trong. Tiếp tục?")) return
    await fetch(`/api/dish-groups/${id}`, { method: "DELETE" })
    load()
    toast({ description: "Đã xóa nhóm món.", variant: "destructive" })
  }

  async function addDish(groupId: string) {
    if (!newDish.name.trim()) return
    const res = await fetch("/api/dishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId,
        name: newDish.name.trim(),
        unit: newDish.unit || "phần",
        description: newDish.description || null,
        image: newDish.image || null,
        postId: newDish.postId || null,
      }),
    })
    if (res.ok) {
      setAddingDishFor(null)
      setNewDish({ name: "", unit: "phần", description: "", image: "", postId: "" })
      load()
      toast({ description: "Đã thêm món." })
    }
  }

  async function toggleAvailable(dish: Dish) {
    await fetch(`/api/dishes/${dish.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !dish.available }),
    })
    load()
  }

  async function updateDish(id: string) {
    await fetch(`/api/dishes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editDish.name,
        unit: editDish.unit,
        description: editDish.description || null,
        image: editDish.image || null,
        postId: editDish.postId || null,
      }),
    })
    setEditDishId(null)
    load()
    toast({ description: "Đã cập nhật món." })
  }

  async function deleteDish(id: string) {
    if (!confirm("Xóa món này?")) return
    await fetch(`/api/dishes/${id}`, { method: "DELETE" })
    load()
    toast({ description: "Đã xóa món.", variant: "destructive" })
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Thực đơn & Bảng giá"
        text="Quản lý các nhóm món và giá bán"
      >
        <div className="flex items-center gap-2">
          <DishesImportExport onImported={load} />
          <Button size="sm" onClick={() => setAddingGroup(true)} className="gap-1.5">
            <span className="text-base leading-none">+</span> Thêm nhóm
          </Button>
        </div>
      </DashboardHeader>

      {/* Add group form */}
      {addingGroup && (
        <div className="flex gap-2 mb-6 p-4 rounded-xl border bg-muted/30">
          <Input
            placeholder="Tên nhóm (VD: Heo Quay, Vịt Quay...)"
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addGroup()}
            autoFocus
            className="max-w-sm"
          />
          <Button size="sm" onClick={addGroup}>Tạo nhóm</Button>
          <Button size="sm" variant="ghost" onClick={() => { setAddingGroup(false); setNewGroupName("") }}>Hủy</Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border overflow-hidden">
              <div className="h-12 shimmer" />
              <div className="divide-y">
                {[1, 2].map(j => <div key={j} className="h-14 shimmer opacity-60" />)}
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <span className="text-5xl block mb-4">🍽️</span>
          <p className="font-medium mb-1">Chưa có nhóm món nào</p>
          <p className="text-sm">Bấm &quot;+ Thêm nhóm&quot; để bắt đầu tạo thực đơn.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group.id} className="rounded-2xl border overflow-hidden shadow-sm">

              {/* ── Group header ─────────────────────────── */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-muted/40 border-b">
                {editGroupId === group.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editGroupName}
                      onChange={e => setEditGroupName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && updateGroup(group.id)}
                      className="max-w-xs h-8 text-sm"
                      autoFocus
                    />
                    <Button size="sm" className="h-8 text-xs" onClick={() => updateGroup(group.id)}>Lưu</Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditGroupId(null)}>Hủy</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="w-1 h-5 rounded-full bg-primary" />
                    <h3 className="font-heading font-bold text-sm">{group.name}</h3>
                    <span className="text-xs text-muted-foreground bg-background border rounded-full px-2 py-0.5">
                      {group.dishes.length} món
                    </span>
                  </div>
                )}

                {editGroupId !== group.id && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => { setEditGroupId(group.id); setEditGroupName(group.name) }}
                    >
                      Đổi tên
                    </Button>
                    <Button
                      size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteGroup(group.id)}
                    >
                      Xóa nhóm
                    </Button>
                  </div>
                )}
              </div>

              {/* ── Dish list ────────────────────────────── */}
              <div className="divide-y">
                {group.dishes.map(dish => (
                  <div
                    key={dish.id}
                    className={cn(
                      "px-5 py-3.5 transition-colors",
                      !dish.available && "bg-muted/20"
                    )}
                  >
                    {editDishId === dish.id ? (
                      /* Edit form */
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input
                            placeholder="Tên món *"
                            value={editDish.name}
                            onChange={e => setEditDish(d => ({ ...d, name: e.target.value }))}
                            autoFocus
                          />
                          <Input
                            placeholder="Đơn vị"
                            value={editDish.unit}
                            onChange={e => setEditDish(d => ({ ...d, unit: e.target.value }))}
                          />
                        </div>
                        <Input
                          placeholder="Mô tả (tuỳ chọn)"
                          value={editDish.description}
                          onChange={e => setEditDish(d => ({ ...d, description: e.target.value }))}
                        />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">Ảnh món (tuỳ chọn)</p>
                          <ImageUploader
                            value={editDish.image}
                            onChange={url => setEditDish(d => ({ ...d, image: url }))}
                            className="max-w-[200px]"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">Liên kết bài viết (tuỳ chọn)</p>
                          <select
                            value={editDish.postId}
                            onChange={e => setEditDish(d => ({ ...d, postId: e.target.value }))}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">-- Không liên kết --</option>
                            {posts.map(p => (
                              <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-xs" onClick={() => updateDish(dish.id)}>Lưu</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditDishId(null)}>Hủy</Button>
                        </div>
                      </div>
                    ) : (
                      /* Dish row */
                      <div className={cn("flex items-center gap-4", !dish.available && "opacity-50")}>
                        {/* Thumbnail */}
                        {dish.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted border">
                            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg shrink-0 bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground/40 text-lg">
                            🍽️
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-sm">{dish.name}</p>
                            {dish.postId && (
                              <a href={`/posts/${dish.postId}`} target="_blank" rel="noreferrer" title="Xem bài viết liên kết" className="text-primary/60 hover:text-primary transition-colors shrink-0">
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
                              </a>
                            )}
                          </div>
                          {dish.description && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{dish.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <span className="text-xs text-muted-foreground">{dish.unit}</span>

                          <button
                            onClick={() => toggleAvailable(dish)}
                            title={dish.available ? "Click để đánh dấu hết hàng" : "Click để mở lại"}
                            className={cn(
                              "text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all",
                              dish.available
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            )}
                          >
                            {dish.available ? "✓ Có sẵn" : "Hết"}
                          </button>

                          <Button
                            size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            title="Sửa món"
                            onClick={() => {
                              setEditDishId(dish.id)
                              setEditDish({ name: dish.name, unit: dish.unit, description: dish.description ?? "", image: dish.image ?? "", postId: dish.postId ?? "" })
                            }}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            title="Xóa món"
                            onClick={() => deleteDish(dish.id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* ── Add dish ─────────────────────────────── */}
                {addingDishFor === group.id ? (
                  <div className="px-5 py-4 bg-primary/3 border-t border-primary/10 space-y-2.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Thêm món mới</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="Tên món *"
                        value={newDish.name}
                        onChange={e => setNewDish(d => ({ ...d, name: e.target.value }))}
                        autoFocus
                      />
                      <Input
                        placeholder="Đơn vị"
                        value={newDish.unit}
                        onChange={e => setNewDish(d => ({ ...d, unit: e.target.value }))}
                      />
                    </div>
                    <Input
                      placeholder="Mô tả ngắn (tuỳ chọn)"
                      value={newDish.description}
                      onChange={e => setNewDish(d => ({ ...d, description: e.target.value }))}
                    />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Ảnh món (tuỳ chọn)</p>
                      <ImageUploader
                        value={newDish.image}
                        onChange={url => setNewDish(d => ({ ...d, image: url }))}
                        className="max-w-[200px]"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Liên kết bài viết (tuỳ chọn)</p>
                      <select
                        value={newDish.postId}
                        onChange={e => setNewDish(d => ({ ...d, postId: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">-- Không liên kết --</option>
                        {posts.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 text-xs" onClick={() => addDish(group.id)}>+ Thêm món</Button>
                      <Button
                        size="sm" variant="ghost" className="h-8 text-xs"
                        onClick={() => { setAddingDishFor(null); setNewDish({ name: "", unit: "phần", description: "", image: "", postId: "" }) }}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-2.5">
                    <button
                      onClick={() => { setAddingDishFor(group.id); setAddingDishFor(group.id) }}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-base leading-none">+</span> Thêm món vào nhóm này
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
