export default function OverviewCards({ stats, timeline, affectionScore, affectionLevel }) {
  // Compute 7-day trend from affection history
  const computeTrend = () => {
    if (!timeline || timeline.length === 0) return null

    const now = Date.now()
    const DAY = 86400000

    const last7Total = timeline
      .filter(e => (now - new Date(e.created_at).getTime()) < 7 * DAY)
      .reduce((s, e) => s + (e.delta || 0), 0)

    const prev7Total = timeline
      .filter(e => {
        const diff = now - new Date(e.created_at).getTime()
        return diff >= 7 * DAY && diff < 14 * DAY
      })
      .reduce((s, e) => s + (e.delta || 0), 0)

    return { last7Total, prev7Total, diff: last7Total - prev7Total }
  }

  const trend = computeTrend()

  const trendDisplay = () => {
    if (!trend) return { icon: 'fa-minus', color: 'text-daria-text-muted', text: 'No data' }
    if (trend.diff > 0) return { icon: 'fa-arrow-up', color: 'text-daria-green', text: `+${trend.diff} vs prev week` }
    if (trend.diff < 0) return { icon: 'fa-arrow-down', color: 'text-daria-orange', text: `${trend.diff} vs prev week` }
    return { icon: 'fa-minus', color: 'text-daria-text-muted', text: 'No change' }
  }

  const trendInfo = trendDisplay()

  const cards = [
    {
      icon: 'fa-comment-dots',
      label: 'Total Chat Rounds',
      value: stats?.totalMessages ?? 0,
      color: 'text-daria-green',
    },
    {
      icon: 'fa-calendar-day',
      label: 'Days Since First Chat',
      value: stats?.daysSinceFirst ?? 0,
      color: 'text-daria-purple',
    },
    {
      icon: 'fa-heart',
      label: 'Affection Score',
      value: `${affectionScore ?? 0}`,
      subtext: affectionLevel?.name || 'Unknown',
      color: 'text-daria-pink',
    },
    {
      icon: trendInfo.icon,
      label: '7-Day Trend',
      value: trend ? `${trend.diff > 0 ? '+' : ''}${trend.diff}` : '--',
      subtext: trendInfo.text,
      color: trendInfo.color,
    },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <i className={`fas ${card.icon} ${card.color} text-xl`}></i>
              <span className="text-sm text-daria-text-muted">{card.label}</span>
            </div>
            <div className="text-3xl font-bold text-daria-text">{card.value}</div>
            {card.subtext && (
              <div className="text-xs text-daria-text-dim mt-1">{card.subtext}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
