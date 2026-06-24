import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="space-y-2 mb-8">
        <p className="text-8xl">🔥</p>
        <h1 className="font-heading text-8xl font-bold">404</h1>
      </div>

      <div className="space-y-3 mb-10 max-w-md">
        <h2 className="font-heading text-2xl font-semibold">
          Trang này đã quay đi đâu mất rồi!
        </h2>
        <p className="text-muted-foreground">
          Heo quay, gà quay, vịt quay thì còn đây — nhưng trang bạn tìm thì không thấy.
          Có thể đường link bị sai hoặc trang đã được dời đi chỗ khác.
        </p>
      </div>

      <div className="flex items-center gap-3 text-4xl mb-10" aria-hidden>
        <span title="Heo quay">🐷</span>
        <span title="Gà quay">🍗</span>
        <span title="Vịt quay">🦆</span>
      </div>

      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}>
        Về trang chủ
      </Link>
    </div>
  )
}
