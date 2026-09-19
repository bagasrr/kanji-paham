export default function GlobalLoading() {
  return (
    <div className="py-6 max-w-2xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 rounded-3xl bg-card-muted/60 mb-4" />
        <div className="h-8 w-48 rounded-2xl bg-card-muted/70 mb-3" />
        <div className="h-4 w-72 rounded-xl bg-card-muted/40" />
      </div>

      {/* Cards Skeleton List */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border border-border-color/60 bg-surface flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-card-muted/70 flex-shrink-0" />
              <div className="space-y-2 flex-1 max-w-xs">
                <div className="h-5 w-3/4 rounded-lg bg-card-muted/70" />
                <div className="h-3.5 w-1/2 rounded-md bg-card-muted/40" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-card-muted/50 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
