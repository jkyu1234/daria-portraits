const TOPICS = {
  school: {
    keywords: ['school', 'class', 'teacher', 'homework', 'test', 'exam', 'grade', 'lawndale', 'principal', 'pep rally'],
    color: 'bg-daria-green',
    icon: 'fa-school',
    label: 'School',
  },
  family: {
    keywords: ['quinn', 'sister', 'mom', 'dad', 'helen', 'jake', 'parent', 'family'],
    color: 'bg-daria-pink',
    icon: 'fa-users',
    label: 'Family',
  },
  art: {
    keywords: ['jane', 'art', 'paint', 'draw', 'artist', 'gallery', 'creative'],
    color: 'bg-daria-purple',
    icon: 'fa-paint-brush',
    label: 'Art',
  },
  tv: {
    keywords: ['sick sad world', 'show', 'watch', 'episode', 'television'],
    color: 'bg-daria-orange',
    icon: 'fa-tv',
    label: 'TV & Media',
  },
  food: {
    keywords: ['pizza', 'food', 'eat', 'cafeteria', 'coffee', 'lunch'],
    color: 'bg-daria-green',
    icon: 'fa-utensils',
    label: 'Food',
  },
  philosophy: {
    keywords: ['think', 'believe', 'world', 'life', 'people', 'society', 'human', 'stupid', 'smart', 'idea', 'opinion'],
    color: 'bg-daria-purple',
    icon: 'fa-brain',
    label: 'Philosophy',
  },
}

export default function TopicPie({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
        <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Conversation Topics</h2>
        <p className="text-daria-text-muted text-sm">No messages to analyze yet.</p>
      </div>
    )
  }

  // Count keyword matches per topic
  const counts = {}
  Object.keys(TOPICS).forEach((t) => {
    counts[t] = 0
  })

  messages.forEach((msg) => {
    if (!msg) return
    const lower = msg.toLowerCase()
    Object.entries(TOPICS).forEach(([topic, config]) => {
      config.keywords.forEach((kw) => {
        if (lower.includes(kw)) {
          counts[topic]++
        }
      })
    })
  })

  const maxCount = Math.max(...Object.values(counts), 1)

  return (
    <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
      <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Conversation Topics</h2>

      {Object.values(counts).every((c) => c === 0) ? (
        <p className="text-daria-text-muted text-sm">
          No recognizable topics found yet. Try mentioning school, family, art, or philosophy!
        </p>
      ) : (
        <div className="space-y-3">
          {Object.entries(TOPICS).map(([topic, config]) => {
            const count = counts[topic]
            const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0

            return (
              <div key={topic}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <i className={`fas ${config.icon} text-daria-text-muted text-sm w-4`}></i>
                    <span className="text-sm text-daria-text-muted">{config.label}</span>
                  </div>
                  <span className="text-sm text-daria-text-dim font-mono">{count}</span>
                </div>
                <div className="w-full bg-daria-border rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
