export default function Timeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
        <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Affection Timeline</h2>
        <p className="text-daria-text-muted text-sm">No affection history yet. Start chatting with Daria!</p>
      </div>
    )
  }

  const recent = timeline.slice(0, 20)

  return (
    <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
      <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Affection Timeline</h2>
      <p className="text-xs text-daria-text-dim mb-4">
        Showing the {recent.length} most recent changes
      </p>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[104px] top-0 bottom-0 w-px bg-daria-border"></div>

        <div className="space-y-0">
          {recent.map((entry, i) => {
            const date = new Date(entry.created_at)
            const dateStr = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
            const delta = entry.delta || 0
            const isPositive = delta > 0
            const isNegative = delta < 0
            const colorClass = isPositive
              ? 'text-daria-green'
              : isNegative
              ? 'text-daria-orange'
              : 'text-daria-text-muted'
            const bgDotClass = isPositive
              ? 'bg-daria-green'
              : isNegative
              ? 'bg-daria-orange'
              : 'bg-daria-text-dim'
            const sign = isPositive ? '+' : ''

            return (
              <div key={i} className="flex items-center py-2 group">
                {/* Date */}
                <div className="w-24 text-right pr-4 flex-shrink-0">
                  <span className="text-xs text-daria-text-dim">{dateStr}</span>
                </div>

                {/* Dot on vertical line */}
                <div className="relative flex items-center justify-center flex-shrink-0 z-10">
                  <div className={`w-2.5 h-2.5 rounded-full ${bgDotClass} ring-2 ring-daria-bg`}></div>
                </div>

                {/* Score change */}
                <div className="ml-4">
                  <span className={`text-sm font-semibold ${colorClass}`}>
                    {sign}{delta}
                  </span>
                  <span className="text-xs text-daria-text-dim ml-2">
                    ({entry.score_before || '?'} &rarr; {entry.score_after || '?'})
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
