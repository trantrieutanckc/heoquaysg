interface StarDisplayProps {
  rating: number // 1-5
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
  count?: number
}

const SIZE = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" }

export function StarDisplay({ rating, size = "md", showNumber = false, count }: StarDisplayProps) {
  const filled = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`${SIZE[size]} ${i < filled ? "fill-amber-400 stroke-amber-400" : "fill-transparent stroke-amber-300"}`}
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
      {showNumber && (
        <span className="ml-1 text-xs text-muted-foreground font-medium">
          {rating.toFixed(1)}{count != null ? ` (${count})` : ""}
        </span>
      )}
    </span>
  )
}
