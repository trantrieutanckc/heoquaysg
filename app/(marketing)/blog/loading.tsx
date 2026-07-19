import { FunnyLoadingText } from "@/components/funny-loading-text"

export default function Loading() {
  return (
    <div className="container py-6 lg:py-10">
      <div className="h-10 w-32 rounded-lg shimmer mb-3" />
      <div className="h-5 w-64 rounded-lg shimmer mb-8" />
      <hr className="my-8" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-video rounded-md shimmer" />
            <div className="h-4 w-24 rounded shimmer" />
            <div className="h-6 w-full rounded shimmer" />
            <div className="h-6 w-3/4 rounded shimmer" />
            <div className="h-4 w-32 rounded shimmer" />
          </div>
        ))}
      </div>
      <FunnyLoadingText />
    </div>
  )
}
