export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 sm:px-6 py-12 lg:py-16">
          <div className="h-8 w-48 rounded-lg bg-muted mb-3" />
          <div className="h-5 w-72 rounded-lg bg-muted" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="container px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-video rounded-md bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-6 w-full rounded bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
