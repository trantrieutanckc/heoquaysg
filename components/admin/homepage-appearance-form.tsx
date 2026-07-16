"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import type { SiteConfigData } from "@/components/admin/site-config-form"
import { SaveOverlay } from "@/components/ui/save-overlay"
import { MiniTiptapEditor } from "@/components/admin/mini-tiptap-editor"
import { Icons } from "@/components/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImagePickerInput } from "@/components/admin/image-picker-input"

// ── Helpers ──────────────────────────────────────────────────

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-sm">{title}</h2>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function BgField({
  label,
  colorKey,
  imageKey,
  data,
  set,
}: {
  label: string
  colorKey: keyof SiteConfigData
  imageKey: keyof SiteConfigData
  data: SiteConfigData
  set: (key: keyof SiteConfigData, val: string) => void
}) {
  const color = (data[colorKey] as string) ?? ""
  const image = (data[imageKey] as string) ?? ""

  return (
    <div className="grid gap-3 border rounded-lg p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>

      {/* Preview */}
      <div
        className="h-16 w-full rounded border overflow-hidden"
        style={
          image
            ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }
            : color
            ? { backgroundColor: color }
            : undefined
        }
      >
        {!image && !color && (
          <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
            Mặc định
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {/* Color picker */}
        <div className="grid gap-1.5">
          <Label className="text-xs">Màu nền</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={color || "#ffffff"}
              onChange={(e) => set(colorKey, e.target.value)}
              className="h-9 w-12 rounded border cursor-pointer p-0.5 bg-background"
            />
            <Input
              value={color}
              onChange={(e) => set(colorKey, e.target.value)}
              placeholder="#f5f0e8 hoặc để trống"
              className="flex-1 font-mono text-xs"
            />
            {color && (
              <button
                type="button"
                onClick={() => set(colorKey, "")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icons.close className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">Màu hex, rgb, hoặc tên màu CSS</p>
        </div>

        {/* Image Upload */}
        <div className="grid gap-1.5">
          <Label className="text-xs">Ảnh nền — ưu tiên hơn màu</Label>
          <ImagePickerInput
            id={imageKey}
            value={image}
            onChange={(url) => set(imageKey, url)}
            previewClass="h-16 w-full rounded-lg object-cover border"
            placeholder="https://... (hoặc upload ảnh)"
          />
          <p className="text-[11px] text-muted-foreground">Ảnh sẽ phủ toàn section</p>
        </div>
      </div>
    </div>
  )
}

function TextField({
  label,
  fieldKey,
  placeholder,
  data,
  set,
}: {
  label: string
  fieldKey: keyof SiteConfigData
  placeholder: string
  data: SiteConfigData
  set: (key: keyof SiteConfigData, val: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        value={(data[fieldKey] as string) ?? ""}
        onChange={(e) => set(fieldKey, e.target.value)}
        placeholder={placeholder}
        className="text-sm"
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

interface Props {
  initialData: SiteConfigData
  dishGroups: { id: string; name: string }[]
}

export function HomepageAppearanceForm({ initialData, dishGroups }: Props) {
  const [data, setData] = React.useState<SiteConfigData>(initialData)
  const [saving, setSaving] = React.useState(false)

  function set(key: keyof SiteConfigData, val: string) {
    setData((prev) => ({ ...prev, [key]: val }))
  }

  function setContent(key: "homeAboutContent" | "homeBookingContent", val: string) {
    setData((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast({ variant: "success", description: "Đã lưu giao diện homepage." })
      } else {
        toast({ title: "Lỗi", description: "Không thể lưu.", variant: "destructive" })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SaveOverlay visible={saving} />

      <p className="text-xs text-muted-foreground bg-muted/60 border rounded-lg px-4 py-3">
        <strong>Lưu ý:</strong> Nếu để trống cả màu lẫn ảnh, section đó sẽ dùng màu mặc định của hệ thống.
        Ảnh nền sẽ được ưu tiên hơn màu nếu cả hai đều được điền.
      </p>

      <Tabs defaultValue="homepage">
        <TabsList>
          <TabsTrigger value="homepage">Trang chủ</TabsTrigger>
          <TabsTrigger value="booking">Đặt lịch</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-6 mt-6">
          <Section
            title="Section 1 — Sản phẩm nổi bật"
            desc="Tiêu đề và background"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField label='Nhãn nhỏ (label)' fieldKey="homeFeaturedLabel" placeholder="Nổi bật" data={data} set={set} />
              <TextField label='Tiêu đề (title)' fieldKey="homeFeaturedTitle" placeholder="Sản phẩm nổi bật" data={data} set={set} />
            </div>
            <BgField label="Background" colorKey="homeFeaturedBgColor" imageKey="homeFeaturedBgImage" data={data} set={set} />
          </Section>

          <Section
            title="Section 2 — Danh mục món"
            desc="Tiêu đề và background"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField label='Nhãn nhỏ (label)' fieldKey="homeCategoriesLabel" placeholder="Thực đơn" data={data} set={set} />
              <TextField label='Tiêu đề (title)' fieldKey="homeCategoriesTitle" placeholder="Danh mục món" data={data} set={set} />
            </div>
            <BgField label="Background" colorKey="homeCategoriesBgColor" imageKey="homeCategoriesBgImage" data={data} set={set} />
          </Section>

          <Section
            title="Section 3 — Về chúng tôi"
            desc="Nhãn nhỏ, nội dung và background"
          >
            <TextField label='Nhãn nhỏ (label)' fieldKey="homeAboutLabel" placeholder="Câu chuyện của chúng tôi" data={data} set={set} />
            <div className="grid gap-1.5">
              <Label className="text-xs">Nội dung (rich text)</Label>
              <MiniTiptapEditor
                value={data.homeAboutContent}
                onChange={(val) => setContent("homeAboutContent", val)}
                placeholder="Viết câu chuyện thương hiệu, điểm nổi bật..."
              />
              <p className="text-[11px] text-muted-foreground">Hỗ trợ in đậm, in nghiêng, danh sách, link. Nếu để trống sẽ dùng Mô tả ngắn từ Cài đặt.</p>
            </div>
            <BgField label="Background" colorKey="homeAboutBgColor" imageKey="homeAboutBgImage" data={data} set={set} />
          </Section>

          <Section
            title="Section 4 — Bài viết mới nhất"
            desc="Tiêu đề và background"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField label='Nhãn nhỏ (label)' fieldKey="homePostsLabel" placeholder="Khám phá" data={data} set={set} />
              <TextField label='Tiêu đề (title)' fieldKey="homePostsTitle" placeholder="Bài viết mới nhất" data={data} set={set} />
            </div>
            <BgField label="Background" colorKey="homePostsBgColor" imageKey="homePostsBgImage" data={data} set={set} />
          </Section>

          {dishGroups.length > 0 && (
            <Section
              title="Section Thực đơn — Nhóm món hiển thị"
              desc="Chọn các nhóm món sẽ xuất hiện trong section Thực đơn & Bảng giá trên trang chủ."
            >
              <div className="grid gap-2">
                {dishGroups.map((g) => {
                  const selected = (data.homeDishGroupNames ?? "Heo Quay|Heo Sữa Quay|Heo Cúng")
                    .split("|")
                    .map((s) => s.trim())
                    .filter(Boolean)
                  const checked = selected.includes(g.name)
                  return (
                    <label key={g.id} className="flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 hover:bg-muted/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? selected.filter((n) => n !== g.name)
                            : [...selected, g.name]
                          set("homeDishGroupNames", next.join("|"))
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm font-medium">{g.name}</span>
                    </label>
                  )
                })}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Các nhóm không chọn vẫn hiển thị đầy đủ trên trang <strong>/thuc-don</strong>.
              </p>
            </Section>
          )}

          <Section
            title="Section 5 — Bản đồ"
            desc="Background phía sau section bản đồ và địa chỉ"
          >
            <BgField
              label="Bản đồ"
              colorKey="homeMapBgColor"
              imageKey="homeMapBgImage"
              data={data}
              set={set}
            />
          </Section>
        </TabsContent>

        <TabsContent value="booking" className="space-y-6 mt-6">
          <Section
            title="Banner Đặt lịch"
            desc="Hiển thị ở cuối trang chủ, trang blog và trang danh mục"
          >
            <TextField label='Nhãn nhỏ (label)' fieldKey="homeBookingLabel" placeholder="Giao hàng tận nơi" data={data} set={set} />
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField label='Tiêu đề (title)' fieldKey="homeBookingTitle" placeholder="Đặt lịch ngay hôm nay" data={data} set={set} />
              <TextField label='Mô tả ngắn' fieldKey="homeBookingDesc" placeholder="Chọn món, chọn ngày giao..." data={data} set={set} />
            </div>
            <div className="grid gap-3 border rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nút 1 (trái)</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <TextField label='Text' fieldKey="homeBookingBtn1Text" placeholder="Đặt lịch ngay" data={data} set={set} />
                <TextField label='Link' fieldKey="homeBookingBtn1Link" placeholder="/dat-lich" data={data} set={set} />
              </div>
            </div>
            <div className="grid gap-3 border rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nút 2 (phải)</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <TextField label='Text' fieldKey="homeBookingBtn2Text" placeholder="Xem thực đơn" data={data} set={set} />
                <TextField label='Link' fieldKey="homeBookingBtn2Link" placeholder="/thuc-don" data={data} set={set} />
              </div>
            </div>
            <BgField
              label="Background (mặc định: gradient cam)"
              colorKey="homeBookingBgColor"
              imageKey="homeBookingBgImage"
              data={data}
              set={set}
            />
          </Section>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}
