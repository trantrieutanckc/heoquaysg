"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import type { SiteConfigData } from "@/components/admin/site-config-form"

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-sm">{title}</h2>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function RowGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</div>
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
}

export function AboutEditorForm({ initial }: { initial: SiteConfigData }) {
  const [data, setData] = React.useState<SiteConfigData>(initial)
  const [saving, setSaving] = React.useState(false)

  function set(key: keyof SiteConfigData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) toast({ description: "Đã lưu trang Về chúng tôi." })
    else toast({ description: "Có lỗi xảy ra.", variant: "destructive" })
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">

      {/* Story */}
      <Section title="Câu chuyện" desc="Đoạn giới thiệu hiển thị trong phần story bên trái trang.">
        <Field label="Đoạn 1" hint="Để trống → dùng nội dung mặc định">
          <Textarea
            value={data.aboutStory1 ?? ""}
            onChange={set("aboutStory1")}
            placeholder="Xuất phát từ tình yêu ẩm thực và niềm đam mê bếp núc..."
            className="min-h-[100px] resize-y"
          />
        </Field>
        <Field label="Đoạn 2">
          <Textarea
            value={data.aboutStory2 ?? ""}
            onChange={set("aboutStory2")}
            placeholder="Mỗi con heo được chọn lọc kỹ từ các trang trại uy tín..."
            className="min-h-[100px] resize-y"
          />
        </Field>
      </Section>

      {/* Stats */}
      <Section title="Thống kê" desc="3 con số nổi bật hiển thị giữa trang. Để trống → dùng mặc định.">
        {([
          ["1", "10+", "Năm kinh nghiệm", "Gắn bó với nghề hơn một thập kỷ"],
          ["2", "1000+", "Khách hàng hài lòng", "Phục vụ hàng nghìn lượt khách mỗi tháng"],
          ["3", "3", "Món đặc trưng", "Heo quay, Vịt quay, Gà quay"],
        ] as [string, string, string, string][]).map(([n, defNum, defLabel, defDesc]) => (
          <div key={n} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Stat {n}</p>
            <RowGroup>
              <Field label="Con số">
                <Input value={(data as any)[`aboutStat${n}Number`] ?? ""} onChange={set(`aboutStat${n}Number` as any)} placeholder={defNum} />
              </Field>
              <Field label="Tiêu đề">
                <Input value={(data as any)[`aboutStat${n}Label`] ?? ""} onChange={set(`aboutStat${n}Label` as any)} placeholder={defLabel} />
              </Field>
              <Field label="Mô tả">
                <Input value={(data as any)[`aboutStat${n}Desc`] ?? ""} onChange={set(`aboutStat${n}Desc` as any)} placeholder={defDesc} />
              </Field>
            </RowGroup>
          </div>
        ))}
      </Section>

      {/* Process steps */}
      <Section title="Quy trình" desc="4 bước từ nguyên liệu đến bàn ăn. Để trống → dùng mặc định.">
        {([
          ["1", "Chọn nguyên liệu", "Heo, vịt, gà tươi sống từ trang trại uy tín, kiểm tra kỹ trước khi nhận."],
          ["2", "Ướp gia vị", "Hơn 10 loại gia vị bí truyền, ướp qua đêm để thấm đều từng thớ thịt."],
          ["3", "Quay than hoa", "Quay chậm bằng than hoa 3–4 giờ, xoay đều tay để da vàng giòn đều."],
          ["4", "Giao đến tay bạn", "Chặt nóng, đóng gói cẩn thận, giao tận nơi hoặc nhận trực tiếp tại cửa hàng."],
        ] as [string, string, string][]).map(([n, defTitle, defDesc]) => (
          <div key={n} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Bước {n}</p>
            <TwoCol>
              <Field label="Tiêu đề">
                <Input value={(data as any)[`aboutStep${n}Title`] ?? ""} onChange={set(`aboutStep${n}Title` as any)} placeholder={defTitle} />
              </Field>
              <Field label="Mô tả">
                <Input value={(data as any)[`aboutStep${n}Desc`] ?? ""} onChange={set(`aboutStep${n}Desc` as any)} placeholder={defDesc} />
              </Field>
            </TwoCol>
          </div>
        ))}
      </Section>

      {/* Commitments */}
      <Section title="Cam kết chất lượng" desc="4 điểm cam kết hiển thị dạng lưới. Để trống → dùng mặc định.">
        {([
          ["1", "Nguyên liệu tươi sạch", "Chọn lọc từ các nhà cung cấp uy tín, đảm bảo vệ sinh an toàn thực phẩm."],
          ["2", "Công thức gia truyền", "Bí quyết ướp và nướng đặc biệt tạo nên hương vị độc đáo không đâu có."],
          ["3", "Giao hàng tận nơi", "Phục vụ đặt hàng online, giao tận nơi nhanh chóng và đúng giờ."],
          ["4", "Giá cả hợp lý", "Chất lượng cao với mức giá phải chăng, phù hợp với mọi nhu cầu."],
        ] as [string, string, string][]).map(([n, defTitle, defDesc]) => (
          <div key={n} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Cam kết {n}</p>
            <TwoCol>
              <Field label="Tiêu đề">
                <Input value={(data as any)[`aboutCommit${n}Title`] ?? ""} onChange={set(`aboutCommit${n}Title` as any)} placeholder={defTitle} />
              </Field>
              <Field label="Mô tả">
                <Input value={(data as any)[`aboutCommit${n}Desc`] ?? ""} onChange={set(`aboutCommit${n}Desc` as any)} placeholder={defDesc} />
              </Field>
            </TwoCol>
          </div>
        ))}
      </Section>

      <Button type="submit" disabled={saving}>
        {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Lưu trang Về chúng tôi
      </Button>
    </form>
  )
}
