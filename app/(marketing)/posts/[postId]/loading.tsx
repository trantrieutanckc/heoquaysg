export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="w-full aspect-[16/7] max-h-[480px] shimmer" />
      <div className="container px-4 sm:px-6 py-6 lg:py-10">
        <div className="h-8 w-20 rounded-lg shimmer mb-6" />
        <div className="h-4 w-24 rounded shimmer mb-3" />
        <div className="h-10 w-3/4 rounded-lg shimmer mb-2" />
        <div className="h-10 w-1/2 rounded-lg shimmer mb-6" />
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded shimmer" />
            <div className="h-3 w-20 rounded shimmer" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded shimmer"
              style={{ width: `${[95, 88, 92, 75, 90, 83, 96, 70][i]}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
