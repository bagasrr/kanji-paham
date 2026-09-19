export default function ProfileLoading() {
  return (
    <div className="py-2 pb-24 max-w-2xl mx-auto animate-pulse">
      {/* Title */}
      <div className="h-8 w-40 rounded-xl bg-card-muted/70 mx-auto mb-8" />

      {/* Main card */}
      <div className="bg-surface rounded-3xl border border-border-color p-8 text-center shadow-sm mb-8">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-card-muted/70 mx-auto mb-5" />
        
        {/* Name and email */}
        <div className="h-6 w-36 rounded-lg bg-card-muted/70 mx-auto mb-2" />
        <div className="h-4 w-48 rounded-md bg-card-muted/40 mx-auto mb-6" />

        {/* Badge */}
        <div className="h-7 w-24 rounded-full bg-card-muted/50 mx-auto mb-8" />

        {/* Stats 2 cols */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card-muted/40 rounded-2xl p-4 border border-border-color/50 h-24" />
          <div className="bg-card-muted/40 rounded-2xl p-4 border border-border-color/50 h-24" />
        </div>

        {/* Action button */}
        <div className="h-12 w-full rounded-2xl bg-card-muted/60" />
      </div>
    </div>
  )
}
