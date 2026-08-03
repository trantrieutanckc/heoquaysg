import { FunnyLoadingText } from "@/components/funny-loading-text"

export default function Loading() {
  return (
    <div className="container py-10 space-y-8">
      <div className="h-10 w-64 rounded-lg shimmer" />
      <div className="h-5 w-96 rounded shimmer" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-video rounded-md shimmer" />
            <div className="h-5 w-3/4 rounded shimmer" />
            <div className="h-4 w-1/2 rounded shimmer" />
          </div>
        ))}
      </div>
      <FunnyLoadingText />
    </div>
  )
}
