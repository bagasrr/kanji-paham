export default function SubLevelLoading() {
  return (
    <div className="py-2 pb-24 relative min-h-screen animate-pulse">
      {/* Sticky header skeleton */}
      <div className="pt-4 pb-4 border-b border-border-color mb-8">
        <div className="h-6 w-36 rounded-lg bg-card-muted/60 mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-8 w-44 rounded-xl bg-card-muted/70" />
          <div className="h-6 w-20 rounded-full bg-card-muted/50" />
        </div>
      </div>

      {/* Kanji cards grid / list */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border-color bg-surface p-6 shadow-sm flex flex-col md:flex-row items-center gap-6"
          >
            {/* Big Kanji square skeleton */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-card-muted/60 flex-shrink-0" />
            
            {/* Details skeleton */}
            <div className="flex-1 w-full space-y-3">
              <div className="h-6 w-32 rounded-lg bg-card-muted/70" />
              <div className="space-y-1.5">
                <div className="h-4 w-full rounded bg-card-muted/40" />
                <div className="h-4 w-4/5 rounded bg-card-muted/40" />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-16 rounded-full bg-card-muted/50" />
                <div className="h-6 w-20 rounded-full bg-card-muted/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
