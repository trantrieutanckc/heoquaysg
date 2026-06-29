"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import type { SiteConfigData } from "@/components/site-config-form"

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

        {/* Image URL */}
        <div className="grid gap-1.5">
          <Label className="text-xs">Ảnh nền (URL) — ưu tiên hơn màu</Label>
          <div className="flex gap-2 items-center">
            <Input
              value={image}
              onChange={(e) => set(imageKey, e.target.value)}
              placeholder="https://... (để trống nếu dùng màu)"
              className="flex-1 text-xs"
            />
            {image && (
              <button
                type="button"
                onClick={() => set(imageKey, "")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icons.close className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">Ảnh sẽ phủ toàn section</p>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

interface Props {
  initialData: SiteConfigData
}

export function HomepageAppearanceForm({ initialData }: Props) {
  const [data, setData] = React.useState<SiteConfigData>(initialData)
  const [saving, setSaving] = React.useState(false)

  function set(key: keyof SiteConfigData, val: string) {
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
        toast({ description: "Đã lưu giao diện homepage." })
      } else {
        toast({ title: "Lỗi", description: "Không thể lưu.", variant: "destructive" })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Giao diện Homepage</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Chỉnh màu nền hoặc ảnh nền cho từng section.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Lưu
        </Button>
      </div>

      <p className="text-xs text-muted-foreground bg-muted/60 border rounded-lg px-4 py-3">
        <strong>Lưu ý:</strong> Nếu để trống cả màu lẫn ảnh, section đó sẽ dùng màu mặc định của hệ thống.
        Ảnh nền sẽ được ưu tiên hơn màu nếu cả hai đều được điền.
      </p>

      <Section
        title="Section 1 — Bài viết nổi bật"
        desc="Background phía sau card bài viết featured"
      >
        <BgField
          label="Bài viết nổi bật"
          colorKey="homeFeaturedBgColor"
          imageKey="homeFeaturedBgImage"
          data={data}
          set={set}
        />
      </Section>

      <Section
        title="Section 2 — Danh mục món"
        desc="Background phía sau lưới danh mục"
      >
        <BgField
          label="Danh mục món"
          colorKey="homeCategoriesBgColor"
          imageKey="homeCategoriesBgImage"
          data={data}
          set={set}
        />
      </Section>

      <Section
        title="Section 3 — Về chúng tôi"
        desc="Background phía sau card giới thiệu"
      >
        <BgField
          label="Về chúng tôi"
          colorKey="homeAboutBgColor"
          imageKey="homeAboutBgImage"
          data={data}
          set={set}
        />
      </Section>

      <Section
        title="Section 4 — Bài viết mới nhất"
        desc="Background phía sau lưới bài viết"
      >
        <BgField
          label="Bài viết mới nhất"
          colorKey="homePostsBgColor"
          imageKey="homePostsBgImage"
          data={data}
          set={set}
        />
      </Section>

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

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}
