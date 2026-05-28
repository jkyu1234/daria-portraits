import { useState, useEffect } from 'react'
import { avatarImage, galleryImages } from '../data/images'
import { getExpressionByScore, getDefaultExpression } from '../utils/expressionManager'

// Daria quote for the header
const DARIA_QUOTES = [
  "I don't have low self-esteem. I have low esteem for everyone else.",
  "My name is Daria, and this is my monotonous voice.",
  "Standing here gives me such a feeling of... well, not much really.",
]

function ImageModal({ image, isOpen, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onPrev, onNext])

  if (!isOpen || !image) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="absolute inset-0" onClick={onClose}></div>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
        <i className="fas fa-times text-lg"></i>
      </button>
      <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
        <i className="fas fa-chevron-left text-lg"></i>
      </button>
      <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
        <i className="fas fa-chevron-right text-lg"></i>
      </button>
      <div className="relative max-w-[95vw] max-h-[90vh] m-4">
        <img src={image.url} alt={image.title} className="max-w-full max-h-[90vh] object-contain select-none" draggable={false} />
      </div>
    </div>
  )
}

// Emotion label descriptions
function getEmotionLabel(score) {
  if (score >= 9) return { text: 'Mildly Amused', color: 'text-daria-green', icon: 'fa-smile' }
  if (score >= 7) return { text: 'Slightly Interested', color: 'text-daria-green', icon: 'fa-meh' }
  if (score >= 4) return { text: 'Default Unimpressed', color: 'text-daria-text-muted', icon: 'fa-meh-blank' }
  if (score >= 2) return { text: 'Annoyed', color: 'text-daria-orange', icon: 'fa-frown' }
  if (score >= 1) return { text: 'Very Annoyed', color: 'text-daria-orange', icon: 'fa-angry' }
  return { text: 'Actively Miserable', color: 'text-daria-orange', icon: 'fa-sad-tear' }
}

export default function ImagePanel({ expressionScore = 5, affectionLevel }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentExpression, setCurrentExpression] = useState(getDefaultExpression())
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * DARIA_QUOTES.length))
  const [showScoreChange, setShowScoreChange] = useState(false)
  const prevScore = useState(expressionScore)

  useEffect(() => {
    const newExpression = getExpressionByScore(expressionScore)
    setCurrentExpression(newExpression)
    // Animate score change
    setShowScoreChange(true)
    const timer = setTimeout(() => setShowScoreChange(false), 1500)
    return () => clearTimeout(timer)
  }, [expressionScore])

  // Rotate quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % DARIA_QUOTES.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const emotion = getEmotionLabel(expressionScore)
  const hasExpression = !!currentExpression

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setModalOpen(true)
  }

  return (
    <div className="w-full h-screen bg-daria-bg text-daria-text flex flex-col min-w-0">
      {/* Portrait Section */}
      <div className="flex-shrink-0 p-6 flex flex-col items-center justify-center border-b border-daria-border bg-gradient-to-b from-daria-purple-muted/20 via-daria-bg to-daria-green-muted/10">
        {/* Portrait Frame */}
        <div className="relative group">
          <div className="w-56 h-56 rounded-2xl overflow-hidden bg-daria-surface border-4 border-daria-border shadow-2xl relative">
            {hasExpression ? (
              <img
                src={currentExpression}
                alt="Daria Expression"
                className="w-full h-full object-cover transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-daria-text-dim">
                <div className="text-center">
                  <i className="fas fa-image text-4xl mb-2"></i>
                  <p className="text-xs">Add expression images to</p>
                  <p className="text-xs">src/assets/daria_expression/</p>
                </div>
              </div>
            )}
          </div>

          {/* Score badge */}
          <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full border-4 border-daria-bg shadow-lg flex items-center justify-center transition-all duration-500 ${
            showScoreChange ? 'scale-125' : 'scale-100'
          } ${expressionScore >= 7 ? 'bg-daria-green' : expressionScore <= 2 ? 'bg-daria-orange' : 'bg-daria-surface'}`}>
            <span className="text-white text-xs font-bold">{expressionScore}</span>
          </div>

          {/* Online indicator */}
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-daria-orange rounded-full border-4 border-daria-bg shadow-lg">
            <div className="w-full h-full bg-daria-orange rounded-full animate-pulse opacity-60"></div>
          </div>
        </div>

        {/* Name + Mood */}
        <div className="mt-5 text-center">
          <h3 className="text-2xl font-bold text-daria-text mb-1 font-heading">Daria Morgendorffer</h3>
          <div className="flex items-center justify-center gap-2">
            <i className={`fas ${emotion.icon} ${emotion.color} text-sm`}></i>
            <p className={`${emotion.color} text-sm transition-colors duration-500`}>
              {emotion.text}
            </p>
          </div>
          <p className="text-daria-text-dim text-xs mt-3 italic max-w-xs leading-relaxed transition-opacity duration-500">
            "{DARIA_QUOTES[quoteIndex]}"
          </p>
        </div>
      </div>

      {/* Affection Level Section */}
      {affectionLevel && (
        <div className="flex-shrink-0 px-6 py-4 border-b border-daria-border bg-daria-bg/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <i className="fas fa-heart text-daria-pink text-xs"></i>
              <span className="text-sm font-semibold text-daria-text font-heading">
                {affectionLevel.label}
              </span>
            </div>
            <span className="text-xs text-daria-text-muted">{affectionLevel.score}/{affectionLevel.max}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-daria-border rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-daria-pink to-daria-orange rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, ((affectionLevel.score - affectionLevel.min) / (affectionLevel.max - affectionLevel.min)) * 100)}%`
              }}
            />
          </div>
          <p className="text-xs text-daria-text-dim italic leading-relaxed">
            "{affectionLevel.description}"
          </p>
        </div>
      )}

      {/* Gallery Section */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="mb-3">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2 font-heading">
            <i className="fas fa-images text-daria-purple"></i>
            Gallery
          </h2>
          <p className="text-daria-text-dim text-xs">Images from Lawndale and beyond</p>
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                onClick={() => handleImageClick(image)}
                className="aspect-square bg-daria-surface rounded-card overflow-hidden cursor-pointer hover:ring-2 hover:ring-daria-purple/50 transition-all group"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-daria-text-dim">
            <i className="fas fa-folder-open text-4xl mb-3 block"></i>
            <p className="text-sm">No gallery images yet</p>
            <p className="text-xs mt-1">Add images to src/assets/gallery/</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedImage(null) }}
        onPrev={() => {
          if (!selectedImage) return
          const idx = galleryImages.findIndex(img => img.id === selectedImage.id)
          setSelectedImage(galleryImages[idx > 0 ? idx - 1 : galleryImages.length - 1])
        }}
        onNext={() => {
          if (!selectedImage) return
          const idx = galleryImages.findIndex(img => img.id === selectedImage.id)
          setSelectedImage(galleryImages[idx < galleryImages.length - 1 ? idx + 1 : 0])
        }}
      />
    </div>
  )
}
