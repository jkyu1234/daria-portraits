import { useEffect, useMemo, useState } from 'react'
import { formatCount } from '../lib/format'
import { dariaProfile } from '../data/daria'
import { getSocialEntries, addSocialReaction, getSocialReactions } from '../services/db'

const TABS = ['Notes', 'Quotes', 'Gallery']

// Daria style journal card
function NoteCard({ note, onToggleLike, onNoteClick }) {
  const handleClick = (e) => {
    if (e.target.closest('button')) return
    onNoteClick && onNoteClick(note)
  }

  return (
    <div
      className="p-4 border-b border-daria-border hover:bg-daria-surface/30 cursor-pointer transition-colors group"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-8 h-8 rounded-full bg-daria-purple-muted/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="fas fa-pencil-alt text-xs text-daria-purple/60"></i>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 text-xs text-daria-text-dim">
            <span className="text-daria-text-muted font-medium">Daria</span>
            <span>·</span>
            <span>{note.time}</span>
            {note.tags && note.tags.map(tag => (
              <span key={tag} className="text-daria-purple/60 bg-daria-purple-muted/10 px-1.5 py-0.5 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <p className="text-sm text-daria-text leading-relaxed whitespace-pre-wrap italic border-l-2 border-daria-purple-muted/20 pl-3 group-hover:border-daria-purple/40 transition-colors">
            {note.text}
          </p>

          {/* Actions */}
          <div className="mt-3 flex gap-4 text-daria-text-dim text-xs">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleLike(note.id) }}
              className={`hover:text-daria-pink transition-colors flex items-center gap-1 ${note.liked ? 'text-daria-pink' : ''}`}
            >
              <i className={note.liked ? 'fas fa-heart' : 'far fa-heart'} />
              <span>{note.likes > 0 ? formatCount(note.likes) : ''}</span>
            </button>
            <button className="hover:text-daria-green transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <i className="far fa-comment"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Note detail modal
function NoteModal({ note, isOpen, onClose, profile }) {
  if (!isOpen || !note) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0 z-0" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg max-h-[80vh] mx-4 bg-daria-surface rounded-card overflow-hidden shadow-card border border-daria-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-daria-border">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-daria-bg flex items-center justify-center">
              <i className="fas fa-times text-daria-text-muted"></i>
            </button>
            <h3 className="text-daria-text font-bold font-heading">Mental Note</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-daria-surface">
              <img src={profile?.avatar} alt="Daria" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-daria-text">{profile?.name}</div>
              <div className="text-daria-text-dim text-sm">{note.time}</div>
            </div>
          </div>

          <div className="bg-daria-bg rounded-card p-6 border border-daria-border">
            <p className="text-daria-text leading-relaxed italic text-lg">{note.text}</p>
          </div>

          {note.tags && (
            <div className="flex gap-2 mt-4">
              {note.tags.map(tag => (
                <span key={tag} className="text-daria-purple bg-daria-purple-muted/10 px-2 py-1 rounded-badge text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Social media entry card
const CATEGORY_CONFIG = {
  show_memory: { label: 'Sick Sad World Memory', icon: 'fa-tv', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', hover: 'hover:border-blue-400/40' },
  late_night: { label: 'Late Night Thought', icon: 'fa-moon', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', hover: 'hover:border-yellow-400/40' },
  milestone: { label: 'Milestone', icon: 'fa-star', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', hover: 'hover:border-purple-400/40' },
}

function SocialCard({ entry, reactions, onReaction, userId }) {
  const config = CATEGORY_CONFIG[entry.category] || { label: 'Quick Note', icon: 'fa-pencil-alt', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', hover: 'hover:border-gray-400/40' }

  return (
    <div className="p-4 border-b border-daria-border hover:bg-daria-surface/30 transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-8 h-8 rounded-full bg-daria-purple-muted/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="fas fa-pencil-alt text-xs text-daria-purple/60"></i>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 text-xs text-daria-text-dim flex-wrap">
            <span className="text-daria-text-muted font-medium">Daria</span>
            <span>·</span>
            <span className={`px-1.5 py-0.5 rounded text-xs ${config.bg} ${config.color} inline-flex items-center gap-1`}>
              <i className={`fas ${config.icon} text-[10px]`}></i>
              {config.label}
            </span>
            {entry.source_episode && (
              <>
                <span>·</span>
                <span className="text-daria-text-dim font-mono text-[10px]">{entry.source_episode}</span>
              </>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-daria-text leading-relaxed whitespace-pre-wrap italic border-l-2 pl-3 transition-colors"
             style={{ borderColor: entry.category === 'show_memory' ? 'rgba(96, 165, 250, 0.2)' : entry.category === 'late_night' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(192, 132, 252, 0.2)' }}>
            {entry.content}
          </p>

          {/* Reactions */}
          <div className="mt-3 flex gap-4 text-daria-text-dim text-xs">
            <ReactionButton
              icon="fa-thumbs-up"
              label="Like"
              count={reactions?.like || 0}
              onClick={() => onReaction && userId && onReaction(entry.id, 'like')}
              disabled={!userId}
            />
            <ReactionButton
              icon="fa-grin-squint"
              label="Laugh"
              count={reactions?.laugh || 0}
              onClick={() => onReaction && userId && onReaction(entry.id, 'laugh')}
              disabled={!userId}
            />
            <ReactionButton
              icon="fa-face-meh-blank"
              label="Think"
              count={reactions?.think || 0}
              onClick={() => onReaction && userId && onReaction(entry.id, 'think')}
              disabled={!userId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ReactionButton({ icon, label, count, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hover:text-daria-green transition-colors flex items-center gap-1 group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={disabled ? 'Sign in to react' : label}
    >
      <i className={`far ${icon} group-hover:scale-110 transition-transform`}></i>
      {count > 0 && <span className="text-daria-text-dim">{count}</span>}
    </button>
  )
}

// Daria profile header
function DariaHeader({ profile }) {
  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-daria-border">
        <div className="flex items-center gap-3">
          <button className="hover:bg-daria-surface rounded-full p-2">
            <i className="fas fa-arrow-left text-lg text-daria-text-muted" />
          </button>
          <div>
            <div className="font-bold text-lg text-daria-text">{profile.name}</div>
            <div className="text-daria-text-dim text-xs">{profile.posts}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="hover:bg-daria-surface rounded-full p-2">
            <i className="fas fa-search text-daria-text-muted text-sm" />
          </button>
        </div>
      </div>

      {/* Cover */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-daria-green-muted via-daria-purple-muted to-daria-bg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white/20 tracking-widest">DARIA</div>
            <div className="text-daria-text-dim text-xs tracking-[0.3em] mt-1">MORGENDORFFER</div>
          </div>
        </div>
        <div className="absolute left-4 bottom-0 transform translate-y-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-daria-bg overflow-hidden bg-daria-surface shadow-xl">
            <img src={profile.avatar} alt="Daria" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="h-14" />
      </div>

      {/* Bio */}
      <div className="p-4">
        <h1 className="text-xl font-bold text-daria-text font-heading">{profile.name}</h1>
        <p className="text-daria-text-muted text-sm italic mt-1 leading-relaxed">
          "{profile.bio}"
        </p>
        <div className="flex items-center gap-1 mt-2 text-daria-text-dim text-xs">
          <i className="fas fa-calendar-alt text-xs" />
          <span>{profile.joined}</span>
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          <div>
            <span className="font-bold text-daria-text">{profile.following}</span>
            <span className="text-daria-text-dim"> Following</span>
          </div>
          <div>
            <span className="font-bold text-daria-text">{profile.followers}</span>
            <span className="text-daria-text-dim"> Followers</span>
          </div>
        </div>
        <p className="text-daria-text-dim text-xs mt-2">{profile.followedBy}</p>
      </div>
    </>
  )
}

export default function JournalPanel({ profile, notes, onToggleLike, activeTab, setActiveTab, userId }) {
  const filtered = useMemo(() => {
    if (activeTab === 'Notes') return notes.filter(n => n.category === 'Notes')
    if (activeTab === 'Quotes') return notes.filter(n => n.category === 'Quotes')
    return notes
  }, [notes, activeTab])

  const [selectedNote, setSelectedNote] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Social media entries
  const [socialEntries, setSocialEntries] = useState([])
  const [reactions, setReactions] = useState({})
  const [socialLoading, setSocialLoading] = useState(false)

  // Fetch social entries on mount
  useEffect(() => {
    let cancelled = false
    const fetchSocial = async () => {
      setSocialLoading(true)
      try {
        const entries = await getSocialEntries()
        if (cancelled) return
        setSocialEntries(entries || [])
        // Fetch reactions for all entries in parallel
        if (entries && entries.length > 0) {
          const reactionResults = await Promise.all(
            entries.map(entry =>
              getSocialReactions(entry.id).then(counts => ({ id: entry.id, counts }))
            )
          )
          if (!cancelled) {
            const reactionMap = {}
            for (const { id, counts } of reactionResults) {
              reactionMap[id] = counts
            }
            setReactions(reactionMap)
          }
        }
      } catch (err) {
        console.error('Failed to fetch social entries:', err)
      } finally {
        if (!cancelled) setSocialLoading(false)
      }
    }
    fetchSocial()
    return () => { cancelled = true }
  }, [])

  const handleReaction = async (entryId, reactionType) => {
    if (!userId) return
    // Optimistic: increment count immediately
    setReactions(prev => ({
      ...prev,
      [entryId]: {
        ...prev[entryId],
        [reactionType]: (prev[entryId]?.[reactionType] || 0) + 1,
      }
    }))
    // Sync with DB
    try {
      await addSocialReaction(userId, entryId, reactionType)
      // Refetch to get accurate counts
      const updatedCounts = await getSocialReactions(entryId)
      setReactions(prev => ({ ...prev, [entryId]: updatedCounts }))
    } catch (err) {
      console.error('Failed to add reaction:', err)
      // Revert optimistic update on error
      setReactions(prev => ({
        ...prev,
        [entryId]: {
          ...prev[entryId],
          [reactionType]: Math.max(0, (prev[entryId]?.[reactionType] || 0) - 1),
        }
      }))
    }
  }

  const handleNoteClick = (note) => {
    setSelectedNote(note)
    setModalOpen(true)
  }

  return (
    <div className="w-full h-screen bg-daria-bg text-daria-text overflow-y-auto min-w-0">
      <DariaHeader profile={profile} />

      {/* Tabs */}
      <div className="sticky top-0 bg-daria-bg z-10 flex border-b border-daria-border font-medium">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-sm transition-colors hover:bg-daria-surface/50 ${
              activeTab === tab
                ? 'text-daria-green border-b-2 border-daria-green'
                : 'text-daria-text-dim'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notes list */}
      <div>
        {activeTab === 'Quotes' ? (
          <div className="p-8 text-center">
            <i className="fas fa-quote-right text-4xl text-daria-text-dim mb-4 block"></i>
            <p className="text-daria-text-muted text-sm">Daria quotes will appear here</p>
            <p className="text-daria-text-dim text-xs mt-1">Generated from conversations</p>
          </div>
        ) : activeTab === 'Notes' && socialEntries.length > 0 ? (
          <>
            {/* Social entries from Supabase */}
            {socialEntries.map(entry => (
              <SocialCard
                key={entry.id}
                entry={entry}
                reactions={reactions[entry.id]}
                onReaction={handleReaction}
                userId={userId}
              />
            ))}

            {/* Separator */}
            {filtered.length > 0 && (
              <div className="px-4 py-3 bg-daria-surface/40 border-b border-daria-border">
                <p className="text-xs text-daria-text-muted font-medium flex items-center gap-2">
                  <i className="fas fa-book-open text-daria-text-dim"></i>
                  Your Journal Notes
                </p>
              </div>
            )}

            {/* Local notes */}
            {filtered.length > 0 ? (
              filtered.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onToggleLike={onToggleLike}
                  onNoteClick={handleNoteClick}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <i className="fas fa-book-open text-4xl text-daria-text-dim mb-4 block"></i>
                <p className="text-daria-text-muted text-sm">No mental notes yet</p>
                <p className="text-daria-text-dim text-xs mt-1">Start a conversation with Daria!</p>
              </div>
            )}
          </>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-book-open text-4xl text-daria-text-dim mb-4 block"></i>
            <p className="text-daria-text-muted text-sm">No mental notes yet</p>
            <p className="text-daria-text-dim text-xs mt-1">Start a conversation with Daria!</p>
          </div>
        ) : (
          filtered.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleLike={onToggleLike}
              onNoteClick={handleNoteClick}
            />
          ))
        )}
      </div>

      {/* Note Modal */}
      <NoteModal
        note={selectedNote}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedNote(null) }}
        profile={profile}
      />
    </div>
  )
}
