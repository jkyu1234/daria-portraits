import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getUserStats, getAffectionTimeline } from '../../services/db'
import OverviewCards from './OverviewCards'
import WordCloud from './WordCloud'
import Heatmap from './Heatmap'
import Timeline from './Timeline'
import TopicPie from './TopicPie'

export default function Dashboard({ user, onClose, affectionScore, affectionLevel }) {
  const [stats, setStats] = useState(null)
  const [messages, setMessages] = useState([])
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchData() {
      try {
        const [userStats, msgResult, affectionTimeline] = await Promise.all([
          getUserStats(user.id),
          supabase
            .from('chat_messages')
            .select('content, created_at, role')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true }),
          getAffectionTimeline(user.id),
        ])
        if (cancelled) return
        setStats(userStats)
        setMessages(msgResult.data || [])
        setTimeline(affectionTimeline)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
        if (!cancelled) setError('Failed to load dashboard data. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => { cancelled = true }
  }, [user])

  const userMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)

  // Guest state
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="relative bg-daria-bg rounded-card p-8 max-w-md w-full mx-4 text-center border border-daria-border">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-daria-bg hover:bg-daria-surface rounded-full text-daria-text transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
          <i className="fas fa-chart-bar text-4xl text-daria-text-dim mb-4 mt-2"></i>
          <h2 className="text-xl font-bold text-daria-text mb-2 font-heading">Dashboard</h2>
          <p className="text-daria-text-muted">Sign in to see your Daria dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto">
      <div className="relative w-full max-w-4xl mx-auto my-8 px-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right z-10 w-8 h-8 flex items-center justify-center bg-daria-surface hover:bg-daria-border rounded-full text-daria-text transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>

        <h1 className="text-2xl font-bold text-daria-text mb-6 pt-2 font-heading">Your Daria Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-daria-green"></div>
            <span className="ml-3 text-daria-text-muted">Loading your stats...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="space-y-6 pb-8">
            <OverviewCards
              stats={stats}
              timeline={timeline}
              affectionScore={affectionScore}
              affectionLevel={affectionLevel}
            />
            {userMessages.length > 0 && (
              <>
                <WordCloud messages={userMessages} />
                <Heatmap messages={messages} />
                <TopicPie messages={userMessages} />
              </>
            )}
            <Timeline timeline={timeline} />
          </div>
        )}
      </div>
    </div>
  )
}
