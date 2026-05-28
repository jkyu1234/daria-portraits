import { useEffect, useState, useRef } from 'react'
import ChatPanel from './components/ChatPanel'
import ImagePanel from './components/ImagePanel'
import JournalPanel from './components/JournalPanel'
import AuthModal from './components/AuthModal'
import AffectionBadge from './components/AffectionBadge'
import AchievementWall from './components/AchievementWall'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAffection } from './hooks/useAffection'
import { initialNotes, dariaProfile } from './data/daria'
import { sendChatMessage, validateApiConfig } from './services/difyApi'
import { ACHIEVEMENTS, checkAchievements } from './data/achievements'
import { getUserStats, getUnlockedAchievements, unlockAchievement } from './services/db'
import Dashboard from './components/Dashboard/Dashboard'

export default function App() {
  const { user, isGuest, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const menuRef = useRef(null)

  const [messages, setMessages] = useState([
    { side: 'right', text: 'Hey Daria! What do you think about the world today?' },
    { side: 'left', text: 'The world is the same as it was yesterday: deeply flawed and loudly in denial about it. But I appreciate you asking. Most people just want to know if I\'ve seen Quinn\'s new shoes.' },
  ])

  const [notes, setNotes] = useLocalStorage('daria.notes', initialNotes)
  const [activeTab, setActiveTab] = useLocalStorage('daria.activeTab', 'Notes')
  const [expressionScore, setExpressionScore] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [unlockedKeys, setUnlockedKeys] = useState([])
  const [achievementToast, setAchievementToast] = useState(null)

  const [leftWidth, setLeftWidth] = useState(30)
  const [rightWidth, setRightWidth] = useState(30)
  const middleWidth = 100 - leftWidth - rightWidth

  const [isDragging, setIsDragging] = useState(null)
  const containerRef = useRef(null)

  const { score: affectionScore, level: affectionLevel, lastDelta, showDelta, applyDelta } = useAffection()

  const checkAndUnlockAchievements = async () => {
    if (!user) return
    try {
      const stats = await getUserStats(user.id)
      if (!stats) return
      const unlocked = await getUnlockedAchievements(user.id)
      const earned = checkAchievements(stats)
      const newlyEarned = earned.filter(k => !unlocked.includes(k))
      if (newlyEarned.length === 0) return
      setUnlockedKeys(prev => [...new Set([...prev, ...newlyEarned])])
      for (const key of newlyEarned) {
        await unlockAchievement(user.id, key)
      }
      const lastNew = ACHIEVEMENTS.find(a => a.key === newlyEarned[newlyEarned.length - 1])
      if (lastNew) {
        setAchievementToast(lastNew)
        setTimeout(() => setAchievementToast(null), 4000)
      }
    } catch (err) {
      console.error('Achievement check failed:', err)
    }
  }

  const handleSend = async (text) => {
    if (isLoading) return

    if (!validateApiConfig()) {
      alert('Please configure Dify API settings:\n\n1. Click the settings icon (gear) in the chat panel, or\n2. Set VITE_DIFY_API_KEY and VITE_DIFY_BASE_URL in environment variables or .env file')
      return
    }

    setMessages(prev => [...prev, { side: 'right', text }])
    setIsLoading(true)

    try {
      const result = await sendChatMessage(text)

      if (result.success && result.data) {
        const { daria_chat, daria_note, daria_score, affection_delta } = result.data

        if (daria_chat) {
          setMessages(prev => [...prev, { side: 'left', text: daria_chat }])
        }

        if (typeof daria_score === 'number' && daria_score >= 0 && daria_score <= 10) {
          setExpressionScore(daria_score)
        }

        if (typeof affection_delta === 'number' && affection_delta !== 0) {
          applyDelta(affection_delta)
        }

        if (daria_note && typeof daria_note === 'string' && daria_note.length > 8) {
          setNotes(prev => [
            {
              id: Date.now(),
              text: daria_note,
              likes: 0,
              liked: false,
              time: 'just now',
              category: 'Notes'
            },
            ...prev,
          ])
          setActiveTab('Notes')
        }

        // Check achievements after each successful message exchange
        checkAndUnlockAchievements()
      } else {
        setMessages(prev => [...prev, {
          side: 'left',
          text: result.data?.daria_chat || '...Whatever. The system seems to be down.'
        }])
      }
    } catch (error) {
      console.error('Send message failed:', error)
      setMessages(prev => [...prev, {
        side: 'left',
        text: '...Great. Technology has failed me. This is exactly why I keep a paper journal.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLike = (id) => {
    setNotes(prev => prev.map(n => n.id === id
      ? { ...n, liked: !n.liked, likes: n.liked ? Math.max(0, n.likes - 1) : n.likes + 1 }
      : n
    ))
  }

  const handleMouseDown = (divider) => setIsDragging(divider)

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - containerRect.left
    const percentage = (x / containerRect.width) * 100

    if (isDragging === 'left') {
      setLeftWidth(Math.max(15, Math.min(60, percentage)))
    } else if (isDragging === 'right') {
      setRightWidth(Math.max(15, Math.min(60, 100 - percentage)))
    }
  }

  const handleMouseUp = () => setIsDragging(null)

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  // close user menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showUserMenu])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div ref={containerRef} className="flex h-screen bg-daria-bg text-daria-text relative overflow-hidden">
      {/* Auth button - top right */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-daria-surface border border-daria-border hover:bg-daria-border/50 transition-colors"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'} text-sm text-daria-text-muted`}></i>
        </button>
        {isGuest ? (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 bg-daria-surface hover:bg-daria-surface border-daria-border rounded-full px-4 py-2 text-sm text-daria-text transition-colors"
          >
            <i className="fas fa-user"></i>
            Sign In
          </button>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-2 bg-daria-surface hover:bg-daria-surface border-daria-border rounded-full px-3 py-2 text-sm text-daria-text transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-daria-green flex items-center justify-center text-xs font-bold text-white">
                {initial}
              </span>
              <span className="max-w-[100px] truncate">{displayName}</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-daria-surface border-daria-border rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-2 text-xs text-daria-text-muted border-b border-daria-border">
                  {user?.email || ''}
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); setShowDashboard(true) }}
                  className="w-full text-left px-4 py-2 text-sm text-daria-text hover:bg-daria-bg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-id-card"></i>
                  Dashboard
                </button>
                <button
                  onClick={async () => {
                    setShowUserMenu(false)
                    if (user) {
                      try {
                        const keys = await getUnlockedAchievements(user.id)
                        setUnlockedKeys(keys)
                      } catch (e) {
                        console.error('Failed to fetch achievements:', e)
                      }
                    }
                    setShowAchievements(true)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-daria-text hover:bg-daria-bg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-trophy"></i>
                  Achievements
                </button>
                <button
                  onClick={() => { signOut(); setShowUserMenu(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Left panel - Mental Notes */}
      <div className="min-w-0" style={{ width: `${leftWidth}%` }}>
        <JournalPanel
          profile={dariaProfile}
          notes={notes}
          onToggleLike={toggleLike}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userId={user?.id}
        />
      </div>

      <div
        className="w-1 bg-daria-border hover:bg-daria-purple/50 cursor-col-resize flex-shrink-0 transition-colors"
        onMouseDown={() => handleMouseDown('left')}
      />

      {/* Center panel - Daria portrait */}
      <div className="min-w-0" style={{ width: `${middleWidth}%` }}>
        <ImagePanel expressionScore={expressionScore} affectionLevel={affectionLevel} />
      </div>

      <div
        className="w-1 bg-daria-border hover:bg-daria-green/50 cursor-col-resize flex-shrink-0 transition-colors"
        onMouseDown={() => handleMouseDown('right')}
      />

      {/* Right panel - Chat */}
      <div className="min-w-0 relative" style={{ width: `${rightWidth}%` }}>
        <AffectionBadge delta={lastDelta} visible={showDelta} />
        <ChatPanel messages={messages} onSend={handleSend} isLoading={isLoading} user={user} />
      </div>

      {/* Achievement Wall */}
      {showAchievements && (
        <AchievementWall
          unlockedKeys={unlockedKeys}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Achievement Toast */}
      {achievementToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-daria-surface border border-daria-green rounded-card px-5 py-4 shadow-card flex items-center gap-4 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-daria-green/20 flex items-center justify-center text-lg text-daria-green flex-shrink-0">
              <i className={`fas ${achievementToast.icon}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-daria-green/80 font-medium">Achievement Unlocked!</p>
              <p className="text-sm text-white font-bold truncate">{achievementToast.name}</p>
              <p className="text-xs text-daria-text-muted truncate">{achievementToast.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Dashboard */}
      {showDashboard && (
        <Dashboard
          user={user}
          onClose={() => setShowDashboard(false)}
          affectionScore={affectionScore}
          affectionLevel={affectionLevel}
        />
      )}
    </div>
  )
}
