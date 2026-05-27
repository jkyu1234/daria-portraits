import { useMemo, useState } from 'react'
import { formatCount } from '../lib/format'
import { dariaProfile } from '../data/daria'

const TABS = ['Notes', 'Quotes', 'Gallery']

// Daria style journal card
function NoteCard({ note, onToggleLike, onNoteClick }) {
  const handleClick = (e) => {
    if (e.target.closest('button')) return
    onNoteClick && onNoteClick(note)
  }

  return (
    <div
      className="p-4 border-b border-gray-800 hover:bg-gray-800/30 cursor-pointer transition-colors group"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-8 h-8 rounded-full bg-daria-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="fas fa-pencil-alt text-xs text-daria-purple/60"></i>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            <span className="text-gray-400 font-medium">Daria</span>
            <span>·</span>
            <span>{note.time}</span>
            {note.tags && note.tags.map(tag => (
              <span key={tag} className="text-daria-purple/60 bg-daria-purple/10 px-1.5 py-0.5 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap italic border-l-2 border-daria-purple/20 pl-3 group-hover:border-daria-purple/40 transition-colors">
            {note.text}
          </p>

          {/* Actions */}
          <div className="mt-3 flex gap-4 text-gray-600 text-xs">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleLike(note.id) }}
              className={`hover:text-daria-pink transition-colors flex items-center gap-1 ${note.liked ? 'text-daria-pink' : ''}`}
            >
              <i className={note.liked ? 'fas fa-heart' : 'far fa-heart'} />
              <span>{note.likes > 0 ? formatCount(note.likes) : ''}</span>
            </button>
            <button className="hover:text-blue-400 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
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
      <div className="relative z-10 w-full max-w-lg max-h-[80vh] mx-4 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-800 flex items-center justify-center">
              <i className="fas fa-times text-gray-400"></i>
            </button>
            <h3 className="text-white font-bold">Mental Note</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
              <img src={profile?.avatar} alt="Daria" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-white">{profile?.name}</div>
              <div className="text-gray-500 text-sm">{note.time}</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-200 leading-relaxed italic text-lg">{note.text}</p>
          </div>

          {note.tags && (
            <div className="flex gap-2 mt-4">
              {note.tags.map(tag => (
                <span key={tag} className="text-daria-purple bg-daria-purple/10 px-2 py-1 rounded-full text-xs">
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

// Daria profile header
function DariaHeader({ profile }) {
  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button className="hover:bg-gray-800 rounded-full p-2">
            <i className="fas fa-arrow-left text-lg text-gray-400" />
          </button>
          <div>
            <div className="font-bold text-lg text-white">{profile.name}</div>
            <div className="text-gray-500 text-xs">{profile.posts}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="hover:bg-gray-800 rounded-full p-2">
            <i className="fas fa-search text-gray-400 text-sm" />
          </button>
        </div>
      </div>

      {/* Cover */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-[#1a4a2e] via-[#3d2b4f] to-[#1a1a1a] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white/20 tracking-widest">DARIA</div>
            <div className="text-gray-500 text-xs tracking-[0.3em] mt-1">MORGENDORFFER</div>
          </div>
        </div>
        <div className="absolute left-4 bottom-0 transform translate-y-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-[#1a1a1a] overflow-hidden bg-gray-800 shadow-xl">
            <img src={profile.avatar} alt="Daria" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="h-14" />
      </div>

      {/* Bio */}
      <div className="p-4">
        <h1 className="text-xl font-bold text-white">{profile.name}</h1>
        <p className="text-gray-400 text-sm italic mt-1 leading-relaxed">
          "{profile.bio}"
        </p>
        <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
          <i className="fas fa-calendar-alt text-xs" />
          <span>{profile.joined}</span>
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          <div>
            <span className="font-bold text-white">{profile.following}</span>
            <span className="text-gray-500"> Following</span>
          </div>
          <div>
            <span className="font-bold text-white">{profile.followers}</span>
            <span className="text-gray-500"> Followers</span>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-2">{profile.followedBy}</p>
      </div>
    </>
  )
}

export default function JournalPanel({ profile, notes, onToggleLike, activeTab, setActiveTab }) {
  const filtered = useMemo(() => {
    if (activeTab === 'Notes') return notes.filter(n => n.category === 'Notes')
    if (activeTab === 'Quotes') return notes.filter(n => n.category === 'Quotes')
    return notes
  }, [notes, activeTab])

  const [selectedNote, setSelectedNote] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleNoteClick = (note) => {
    setSelectedNote(note)
    setModalOpen(true)
  }

  return (
    <div className="w-full h-screen bg-[#1a1a1a] text-white overflow-y-auto min-w-0">
      <DariaHeader profile={profile} />

      {/* Tabs */}
      <div className="sticky top-0 bg-[#1a1a1a] z-10 flex border-b border-gray-800 font-medium">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-sm transition-colors hover:bg-gray-800/50 ${
              activeTab === tab
                ? 'text-daria-green border-b-2 border-daria-green'
                : 'text-gray-500'
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
            <i className="fas fa-quote-right text-4xl text-gray-700 mb-4 block"></i>
            <p className="text-gray-500 text-sm">Daria quotes will appear here</p>
            <p className="text-gray-600 text-xs mt-1">Generated from conversations</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-book-open text-4xl text-gray-700 mb-4 block"></i>
            <p className="text-gray-500 text-sm">No mental notes yet</p>
            <p className="text-gray-600 text-xs mt-1">Start a conversation with Daria!</p>
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
