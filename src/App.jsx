import { useEffect, useState, useRef } from 'react'
import ChatPanel from './components/ChatPanel'
import ImagePanel from './components/ImagePanel'
import JournalPanel from './components/JournalPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialNotes, dariaProfile } from './data/daria'
import { sendChatMessage, validateApiConfig } from './services/difyApi'

export default function App() {
  const [messages, setMessages] = useState([
    { side: 'right', text: 'Hey Daria! What do you think about the world today?' },
    { side: 'left', text: 'The world is the same as it was yesterday: deeply flawed and loudly in denial about it. But I appreciate you asking. Most people just want to know if I\'ve seen Quinn\'s new shoes.' },
  ])

  const [notes, setNotes] = useLocalStorage('daria.notes', initialNotes)
  const [activeTab, setActiveTab] = useLocalStorage('daria.activeTab', 'Notes')
  const [expressionScore, setExpressionScore] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  const [leftWidth, setLeftWidth] = useState(30)
  const [rightWidth, setRightWidth] = useState(30)
  const middleWidth = 100 - leftWidth - rightWidth

  const [isDragging, setIsDragging] = useState(null)
  const containerRef = useRef(null)

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
        const { daria_chat, daria_note, daria_score } = result.data

        if (daria_chat) {
          setMessages(prev => [...prev, { side: 'left', text: daria_chat }])
        }

        if (typeof daria_score === 'number' && daria_score >= 0 && daria_score <= 10) {
          setExpressionScore(daria_score)
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

  return (
    <div ref={containerRef} className="flex h-screen bg-[#1a1a1a] text-white relative overflow-hidden">
      {/* 左侧面板 - 聊天 */}
      <div className="min-w-0" style={{ width: `${leftWidth}%` }}>
        <ChatPanel messages={messages} onSend={handleSend} isLoading={isLoading} />
      </div>

      <div
        className="w-1 bg-gray-700 hover:bg-daria-green cursor-col-resize flex-shrink-0 transition-colors"
        onMouseDown={() => handleMouseDown('left')}
      />

      {/* 中间面板 - Daria 画像 */}
      <div className="min-w-0" style={{ width: `${middleWidth}%` }}>
        <ImagePanel expressionScore={expressionScore} />
      </div>

      <div
        className="w-1 bg-gray-700 hover:bg-daria-purple cursor-col-resize flex-shrink-0 transition-colors"
        onMouseDown={() => handleMouseDown('right')}
      />

      {/* 右侧面板 - Mental Notes (替代 Twitter) */}
      <div className="min-w-0" style={{ width: `${rightWidth}%` }}>
        <JournalPanel
          profile={dariaProfile}
          notes={notes}
          onToggleLike={toggleLike}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  )
}
