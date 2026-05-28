import { useState, useEffect, useRef } from 'react'
import { createSession, getSessions, saveMessage, getSessionMessages } from '../services/db'
import SessionList from './SessionList'

export default function ChatPanel({ messages, onSend, isLoading = false, user = null }) {
  const [text, setText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [loadedMessages, setLoadedMessages] = useState(null)
  const lastSavedCount = useRef(0)

  useEffect(() => {
    const savedApiKey = localStorage.getItem('dify_api_key')
    const savedBaseUrl = localStorage.getItem('dify_base_url')
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedBaseUrl) setBaseUrl(savedBaseUrl)
  }, [])

  // Init session when user logs in
  useEffect(() => {
    if (!user) {
      setCurrentSessionId(null)
      setLoadedMessages(null)
      lastSavedCount.current = 0
      return
    }

    const init = async () => {
      try {
        const sessions = await getSessions(user.id)
        if (sessions.length > 0) {
          const latest = sessions[0]
          setCurrentSessionId(latest.id)
          const msgs = await getSessionMessages(latest.id)
          if (msgs.length > 0) {
            setLoadedMessages(msgs.map(m => ({
              side: m.role === 'user' ? 'right' : 'left',
              text: m.content
            })))
          }
          lastSavedCount.current = messages.length
        } else {
          const session = await createSession(user.id, 'New Chat')
          setCurrentSessionId(session.id)
          lastSavedCount.current = messages.length
        }
      } catch (err) {
        console.error('Failed to init session:', err)
      }
    }

    init()
  }, [user])

  // Save new messages to DB
  useEffect(() => {
    if (!user || !currentSessionId || loadedMessages) return

    if (messages.length > lastSavedCount.current) {
      const newMsgs = messages.slice(lastSavedCount.current)
      for (const msg of newMsgs) {
        const role = msg.side === 'right' ? 'user' : 'assistant'
        saveMessage(user.id, currentSessionId, role, msg.text).catch(console.error)
      }
      lastSavedCount.current = messages.length
    }
  }, [messages, user, currentSessionId, loadedMessages])

  const saveSettings = () => {
    if (apiKey.trim()) {
      localStorage.setItem('dify_api_key', apiKey.trim())
      window.VITE_DIFY_API_KEY = apiKey.trim()
    } else {
      localStorage.removeItem('dify_api_key')
      delete window.VITE_DIFY_API_KEY
    }

    if (baseUrl.trim()) {
      localStorage.setItem('dify_base_url', baseUrl.trim())
      window.VITE_DIFY_BASE_URL = baseUrl.trim()
    } else {
      localStorage.removeItem('dify_base_url')
      delete window.VITE_DIFY_BASE_URL
    }

    setShowSettings(false)
    alert('Dify settings saved!')
  }

  const handleSend = async () => {
    const t = text.trim()
    if (!t || isLoading) return

    // If viewing a historical session, start a fresh session
    if (loadedMessages && user) {
      try {
        const session = await createSession(user.id, 'New Chat')
        setCurrentSessionId(session.id)
        setLoadedMessages(null)
        lastSavedCount.current = messages.length
      } catch (err) {
        console.error('Failed to create session:', err)
      }
    }

    onSend(t)
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectSession = async (sessionId) => {
    try {
      const msgs = await getSessionMessages(sessionId)
      setLoadedMessages(msgs.map(m => ({
        side: m.role === 'user' ? 'right' : 'left',
        text: m.content
      })))
      setCurrentSessionId(sessionId)
      setShowHistory(false)
    } catch (err) {
      console.error('Failed to load session:', err)
    }
  }

  const handleNewChat = async () => {
    if (!user) return
    try {
      const session = await createSession(user.id, 'New Chat')
      setCurrentSessionId(session.id)
      setLoadedMessages(null)
      lastSavedCount.current = messages.length
      setShowHistory(false)
    } catch (err) {
      console.error('Failed to create session:', err)
    }
  }

  // Display messages: when viewing history show loaded, otherwise show prop messages
  const displayMessages = loadedMessages || messages

  return (
    <div className="w-full h-screen border-r border-daria-border flex flex-col bg-daria-bg text-daria-text min-w-0 relative">
      {/* Session List Sidebar */}
      {showHistory && user && (
        <SessionList
          userId={user.id}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Header */}
      <div className="p-4 border-b border-daria-border flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-daria-green-muted/30 to-daria-bg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-daria-green/40 flex items-center justify-center">
            <i className="fas fa-comment text-sm text-daria-green"></i>
          </div>
          <h2 className="text-lg font-semibold text-daria-text font-heading">Chat with Daria</h2>
        </div>
        <div className="flex items-center gap-1">
          {user && (
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 hover:bg-daria-surface rounded-lg transition-colors"
              title="Chat History"
            >
              <i className="fas fa-history text-daria-text-muted hover:text-white"></i>
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-daria-surface rounded-lg transition-colors"
            title="Dify API Settings"
          >
            <i className="fas fa-cog text-daria-text-muted hover:text-white"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-hide">
        {displayMessages.map((m, idx) => (
          <div key={idx} className={m.side === 'right' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`max-w-[70%] p-3 rounded-lg text-sm leading-relaxed ${
              m.side === 'right'
                ? 'bg-daria-green text-white rounded-br-none shadow-sm'
                : 'bg-daria-surface text-daria-text rounded-bl-none border-l-2 border-daria-orange'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-daria-surface text-daria-text-muted p-3 rounded-lg rounded-bl-none border-l-2 border-daria-orange text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-daria-orange border-t-transparent rounded-full animate-spin"></div>
                Daria is thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-daria-border flex-shrink-0 bg-daria-bg">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            className="flex-1 bg-daria-surface text-daria-text px-4 py-2 rounded-input focus:ring-2 focus:ring-daria-green/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            placeholder={isLoading ? "Waiting for Daria..." : "Say something..."}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !text.trim()}
            className={`rounded-button px-5 py-2 whitespace-nowrap transition-colors text-sm font-medium font-heading ${
              isLoading || !text.trim()
                ? 'bg-daria-border cursor-not-allowed text-daria-text-dim'
                : 'bg-daria-green hover:bg-daria-green-bright text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-daria-surface rounded-card p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-heading">Dify API Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-daria-text-muted hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-daria-text mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-daria-bg text-daria-text px-3 py-2 rounded-input focus:ring-2 focus:ring-daria-green/50 border border-daria-border"
                  placeholder="Enter your Dify API Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-daria-text mb-2">Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full bg-daria-bg text-daria-text px-3 py-2 rounded-input focus:ring-2 focus:ring-daria-green/50 border border-daria-border"
                  placeholder="https://api.dify.ai/v1/chat-messages"
                />
              </div>
              <div className="text-xs text-daria-text-dim">
                <p>Settings are saved locally in your browser.</p>
                <p>Leave empty to use environment variables (.env file).</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveSettings}
                  className="flex-1 bg-daria-green hover:bg-daria-green-bright text-white py-2 px-4 rounded-button transition-colors font-heading"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-daria-surface hover:bg-daria-border text-daria-text py-2 px-4 rounded-button transition-colors font-heading"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
