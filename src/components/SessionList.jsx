import { useState, useEffect } from 'react'
import { getSessions } from '../services/db'

function relativeTime(dateStr) {
  if (!dateStr) return ''
  const now = Date.now()
  const date = new Date(dateStr)
  const diffMs = now - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export default function SessionList({ userId, currentSessionId, onSelectSession, onNewChat, isOpen, onClose }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !userId) return

    const fetchSessions = async () => {
      setLoading(true)
      try {
        const data = await getSessions(userId)
        setSessions(data)
      } catch (err) {
        console.error('Failed to fetch sessions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [isOpen, userId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="relative w-60 bg-daria-bg border-r border-daria-border h-full flex flex-col z-50 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-daria-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-daria-text font-heading">Chat History</h3>
          <button
            onClick={onClose}
            className="text-daria-text-muted hover:text-white p-1 rounded hover:bg-daria-surface transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* New Chat button */}
        <button
          onClick={onNewChat}
          className="mx-3 mt-3 p-2 bg-daria-green/20 hover:bg-daria-green/30 text-daria-green rounded-button text-sm transition-colors border border-daria-green/30 font-medium font-heading"
        >
          <i className="fas fa-plus mr-2"></i>
          New Chat
        </button>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-daria-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-daria-text-dim text-xs text-center py-8">No chat history yet.</p>
          ) : (
            sessions.map(s => (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`p-3 rounded-lg cursor-pointer text-sm transition-colors ${
                  s.id === currentSessionId
                    ? 'bg-daria-green/15 border border-daria-green/30'
                    : 'hover:bg-daria-surface border border-transparent'
                }`}
              >
                <div className="text-daria-text truncate font-medium">{s.title || 'Untitled'}</div>
                <div className="text-daria-text-dim text-xs mt-1">
                  {relativeTime(s.updated_at || s.created_at)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
