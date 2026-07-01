"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Dish {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  available: boolean
  order: number
}

interface DishGroup {
  id: string
  name: string
  order: number
  dishes: Dish[]
}

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ"
}

export default function ThucDonPage() {
  const [groups, setGroups] = React.useState<DishGroup[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newGroupName, setNewGroupName] = React.useState("")
  const [addingGroup, setAddingGroup] = React.useState(false)
  const [editGroupId, setEditGroupId] = React.useState<string | null>(null)
  const [editGroupName, setEditGroupName] = React.useState("")

  const [addingDishFor, setAddingDishFor] = React.useState<string | null>(null)
  const [newDish, setNewDish] = React.useState({ name: "", price: "", unit: "phần", description: "" })

  const [editDishId, setEditDishId] = React.useState<string | null>(null)
  const [editDish, setEditDish] = React.useState({ name: "", price: "", unit: "", description: "" })

  async function load() {
    const res = await fetch("/api/dish-groups")
    setGroups(await res.json())
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
    if (!newDish.name.trim() || !newDish.price) return
    const res = await fetch("/api/dishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId,
        name: newDish.name.trim(),
        price: parseFloat(newDish.price),
        unit: newDish.unit || "phần",
        description: newDish.description || null,
      }),
    })
    if (res.ok) {
      setAddingDishFor(null)
      setNewDish({ name: "", price: "", unit: "phần", description: "" })
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
        price: parseFloat(editDish.price),
        unit: editDish.unit,
        description: editDish.description || null,
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
        <Button size="sm" onClick={() => setAddingGroup(true)} className="gap-1.5">
          <span className="text-base leading-none">+</span> Thêm nhóm
        </Button>
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
                          <div className="flex gap-2">
                            <Input
                              placeholder="Giá (đ) *"
                              type="number"
                              value={editDish.price}
                              onChange={e => setEditDish(d => ({ ...d, price: e.target.value }))}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Đơn vị"
                              value={editDish.unit}
                              onChange={e => setEditDish(d => ({ ...d, unit: e.target.value }))}
                              className="w-24 shrink-0"
                            />
                          </div>
                        </div>
                        <Input
                          placeholder="Mô tả (tuỳ chọn)"
                          value={editDish.description}
                          onChange={e => setEditDish(d => ({ ...d, description: e.target.value }))}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-xs" onClick={() => updateDish(dish.id)}>Lưu</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditDishId(null)}>Hủy</Button>
                        </div>
                      </div>
                    ) : (
                      /* Dish row */
                      <div className={cn("flex items-center gap-4", !dish.available && "opacity-50")}>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{dish.name}</p>
                          {dish.description && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{dish.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <span className="font-heading font-bold text-sm text-primary">
                            {formatPrice(dish.price)}
                            <span className="font-normal text-muted-foreground text-xs ml-0.5">/{dish.unit}</span>
                          </span>

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
                              setEditDish({ name: dish.name, price: String(dish.price), unit: dish.unit, description: dish.description ?? "" })
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
                      <div className="flex gap-2">
                        <Input
                          placeholder="Giá (đ) *"
                          type="number"
                          value={newDish.price}
                          onChange={e => setNewDish(d => ({ ...d, price: e.target.value }))}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Đơn vị"
                          value={newDish.unit}
                          onChange={e => setNewDish(d => ({ ...d, unit: e.target.value }))}
                          className="w-24 shrink-0"
                        />
                      </div>
                    </div>
                    <Input
                      placeholder="Mô tả ngắn (tuỳ chọn)"
                      value={newDish.description}
                      onChange={e => setNewDish(d => ({ ...d, description: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 text-xs" onClick={() => addDish(group.id)}>+ Thêm món</Button>
                      <Button
                        size="sm" variant="ghost" className="h-8 text-xs"
                        onClick={() => { setAddingDishFor(null); setNewDish({ name: "", price: "", unit: "phần", description: "" }) }}
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
