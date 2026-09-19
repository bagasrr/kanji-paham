export default function LevelLoading() {
  return (
    <div className="py-2 pb-10 max-w-2xl mx-auto animate-pulse">
      {/* Back button placeholder */}
      <div className="h-9 w-24 rounded-full bg-card-muted/60 mb-8 border border-border-color/50" />

      {/* Header */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="h-10 w-52 rounded-2xl bg-card-muted/70 mb-3" />
        <div className="h-4 w-60 rounded-xl bg-card-muted/40" />
      </div>

      {/* Sublevel cards list */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border border-border-color/70 bg-surface flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-card-muted/70 flex-shrink-0" />
              <div className="space-y-2 flex-1 max-w-sm">
                <div className="h-5 w-40 rounded-lg bg-card-muted/70" />
                <div className="h-3.5 w-24 rounded-md bg-card-muted/40" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-card-muted/40 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
