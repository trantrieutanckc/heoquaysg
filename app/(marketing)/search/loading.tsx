import { FunnyLoadingText } from "@/components/funny-loading-text"

export default function Loading() {
  return (
    <div className="container px-4 sm:px-6 py-8 lg:py-12">
      <div className="mb-8">
        <div className="h-10 w-40 rounded-lg shimmer mb-4" />
        <div className="h-12 w-full rounded-xl shimmer" />
      </div>
      <div className="divide-y divide-border rounded-xl border overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            <div className="h-20 w-28 rounded-lg shimmer shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 w-3/4 rounded shimmer" />
              <div className="h-5 w-1/2 rounded shimmer" />
              <div className="h-4 w-24 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
      <FunnyLoadingText />
    </div>
  )
}
