import { useState, useMemo } from 'react'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export default function Heatmap({ messages }) {
  const [tooltip, setTooltip] = useState(null)

  const { weeks, monthLabels } = useMemo(() => {
    if (!messages || messages.length === 0) return { weeks: [], monthLabels: [] }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Date 90 days ago
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 89)
    startDate.setHours(0, 0, 0, 0)

    // Find the Monday on or before startDate
    const startDay = startDate.getDay() // 0=Sun, 1=Mon, ...
    const mondayOffset = startDay === 0 ? -6 : 1 - startDay
    const gridStart = new Date(startDate)
    gridStart.setDate(gridStart.getDate() + mondayOffset)

    // Count messages per day
    const dailyCounts = {}
    messages.forEach((m) => {
      if (!m.created_at) return
      const d = new Date(m.created_at)
      d.setHours(0, 0, 0, 0)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      dailyCounts[key] = (dailyCounts[key] || 0) + 1
    })

    // Build grid: each column = 1 week (Mon-Sun)
    const cols = []
    const monthLabels = []
    const cursor = new Date(gridStart)

    while (cursor <= today) {
      const week = []
      let prevMonth = null

      for (let i = 0; i < 7; i++) {
        const date = new Date(cursor)
        date.setDate(date.getDate() + i)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const count = dailyCounts[key] || 0

        // Check if this is a month boundary (first day of month or month change in the Sun row)
        if (i === 6) {
          const thisMonth = date.getMonth()
          if (prevMonth !== null && thisMonth !== prevMonth) {
            monthLabels.push({
              colIndex: cols.length,
              label: MONTH_NAMES[thisMonth],
            })
          } else if (cols.length === 0) {
            // First column — label the start month
            monthLabels.push({
              colIndex: 0,
              label: MONTH_NAMES[gridStart.getMonth()],
            })
          }
          prevMonth = thisMonth
        }

        week.push({
          date,
          count,
          key,
          dateStr: date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        })
      }

      cols.push(week)
      cursor.setDate(cursor.getDate() + 7)
    }

    return { weeks: cols, monthLabels }
  }, [messages])

  const getColorClass = (count) => {
    if (count === 0) return 'bg-daria-surface'
    if (count <= 2) return 'bg-daria-green-muted'
    if (count <= 5) return 'bg-daria-green'
    return 'bg-daria-green-bright'
  }

  const isInRange = (date) => {
    if (!messages || messages.length === 0) return false
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89)
    ninetyDaysAgo.setHours(0, 0, 0, 0)
    return date >= ninetyDaysAgo
  }

  return (
    <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
      <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Activity Heatmap</h2>

      {weeks.length === 0 ? (
        <p className="text-daria-text-muted text-sm">No activity data yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-flex gap-0.5">
            {/* Day labels column */}
            <div className="flex flex-col gap-0.5 mr-1 pt-5">
              {DAY_LABELS.filter((_, i) => i % 2 === 0).map((label) => (
                <div
                  key={label}
                  className="h-3 text-[9px] text-daria-text-dim leading-3 flex items-center"
                  style={{ marginTop: label === 'Mon' ? '0' : label === 'Wed' ? '10px' : '10px' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Grid columns */}
            <div className="flex gap-0.5">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-0.5">
                  {week.map((day, rowIdx) => (
                    <div
                      key={day.key}
                      className={`w-3 h-3 rounded-sm ${getColorClass(day.count)} ${isInRange(day.date) ? 'cursor-pointer hover:ring-1 hover:ring-white/50' : 'opacity-30'}`}
                      onMouseEnter={(e) => {
                        const rect = e.target.getBoundingClientRect()
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          text: day.count > 0
                            ? `${day.count} message${day.count > 1 ? 's' : ''} on ${day.dateStr}`
                            : `No messages on ${day.dateStr}`,
                        })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Month labels at bottom */}
          <div className="flex mt-1 ml-[22px] gap-0.5">
            {monthLabels.map((m, i) => {
              // Calculate position: offset based on colIndex
              const leftPosition = monthLabels.length > 1 && i > 0
                ? `${(m.colIndex / weeks.length) * 100}%`
                : '0'

              return (
                <div
                  key={`${m.label}-${m.colIndex}`}
                  className="text-[9px] text-daria-text-dim"
                  style={{
                    position: 'relative',
                    left: i === 0 ? '0' : undefined,
                    marginLeft: i > 0 ? `${(m.colIndex - monthLabels[i - 1]?.colIndex) * 14 - 4}px` : '0',
                  }}
                >
                  {m.label}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-[10px] text-daria-text-dim">Less</span>
            <div className="w-3 h-3 rounded-sm bg-daria-surface"></div>
            <div className="w-3 h-3 rounded-sm bg-daria-green-muted"></div>
            <div className="w-3 h-3 rounded-sm bg-daria-green"></div>
            <div className="w-3 h-3 rounded-sm bg-daria-green-bright"></div>
            <span className="text-[10px] text-daria-text-dim">More</span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 bg-daria-bg text-daria-text text-xs rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
