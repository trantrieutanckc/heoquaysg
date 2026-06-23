export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="w-full aspect-[16/7] max-h-[480px] bg-muted" />
      <div className="container px-4 sm:px-6 py-6 lg:py-10">
        <div className="h-8 w-20 rounded-lg bg-muted mb-6" />
        <div className="h-4 w-24 rounded bg-muted mb-3" />
        <div className="h-10 w-3/4 rounded-lg bg-muted mb-2" />
        <div className="h-10 w-1/2 rounded-lg bg-muted mb-6" />
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-muted" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
