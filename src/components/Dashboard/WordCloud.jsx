const STOP_WORDS = new Set([
  'the', 'and', 'for', 'you', 'that', 'this', 'with', 'have', 'from',
  'your', 'just', 'like', 'what', 'when', 'about', 'they', 'can', 'all',
  'not', 'but', 'are', 'was', 'will', 'been', 'would', 'could', 'should',
  'more', 'some', 'than', 'its', 'who', 'how', 'very', 'also', 'into',
  'only', 'other', 'then', 'most', 'over', 'back', 'after', 'even',
])

const COLORS = ['#4a7c59', '#7c5cbf', '#c9647a', '#d4845a', '#4a9eff', '#6b7280', '#10b981']

export default function WordCloud({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
        <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Your Most Used Words</h2>
        <p className="text-daria-text-muted text-sm">No messages yet. Start chatting with Daria!</p>
      </div>
    )
  }

  // Count word frequencies
  const wordCounts = {}

  messages.forEach((msg) => {
    if (!msg) return
    const words = msg
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))

    words.forEach((w) => {
      wordCounts[w] = (wordCounts[w] || 0) + 1
    })
  })

  // Sort by frequency and take top 50
  const sorted = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)

  if (sorted.length === 0) {
    return (
      <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
        <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Your Most Used Words</h2>
        <p className="text-daria-text-muted text-sm">Not enough words to analyze yet.</p>
      </div>
    )
  }

  const maxCount = sorted[0][1]
  const minFontSize = 12
  const maxFontSize = 40

  return (
    <div className="bg-daria-surface/80 rounded-card p-5 border border-daria-border/50 shadow-card">
      <h2 className="text-lg font-semibold text-daria-text mb-4 font-heading">Your Most Used Words</h2>
      <div className="flex flex-wrap gap-3 items-center justify-center p-4 min-h-[200px]">
        {sorted.map(([word, count], i) => {
          const fontSize =
            minFontSize + ((count / maxCount) * (maxFontSize - minFontSize))
          const color = COLORS[i % COLORS.length]

          return (
            <span
              key={word}
              className="inline-block leading-tight transition-transform hover:scale-110"
              style={{ fontSize: `${fontSize}px`, color }}
              title={`${word}: ${count} times`}
            >
              {word}
            </span>
          )
        })}
      </div>
    </div>
  )
}
