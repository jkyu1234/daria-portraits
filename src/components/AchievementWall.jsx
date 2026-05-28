import { ACHIEVEMENTS } from '../data/achievements'

export default function AchievementWall({ unlockedKeys, onClose }) {
  const unlockedCount = unlockedKeys?.length || 0
  const totalCount = ACHIEVEMENTS.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0 z-0" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-3xl max-h-[85vh] mx-4 bg-daria-bg rounded-card overflow-hidden shadow-card border border-daria-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-daria-border">
          <div className="flex items-center gap-3">
            <i className="fas fa-trophy text-daria-green text-lg"></i>
            <h2 className="text-daria-text font-bold text-lg font-heading">Achievement Badges</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-daria-surface flex items-center justify-center transition-colors"
          >
            <i className="fas fa-times text-daria-text-muted"></i>
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-4 py-2 text-daria-text-muted text-sm border-b border-daria-border/50">
          {unlockedCount} / {totalCount} unlocked
        </div>

        {/* Grid */}
        <div className="p-4 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map(achievement => {
              const unlocked = unlockedKeys?.includes(achievement.key)
              return (
                <div
                  key={achievement.key}
                  className={`
                    p-4 rounded-card border transition-all duration-300
                    ${unlocked
                      ? 'bg-daria-surface border-daria-green shadow-glow-green'
                      : 'bg-daria-surface border-daria-border'
                    }
                    ${!unlocked ? 'opacity-60 grayscale' : ''}
                  `}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    {/* Icon */}
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300
                        ${unlocked
                          ? 'bg-daria-green/20 text-daria-green shadow-lg shadow-daria-green/20'
                          : 'bg-daria-border/50 text-daria-text-dim'
                        }
                      `}
                    >
                      <i className={`fas ${achievement.icon}`}></i>
                    </div>

                    {/* Name */}
                    <h3 className={`text-sm font-bold ${unlocked ? 'text-daria-text' : 'text-daria-text-dim'}`}>
                      {achievement.name}
                    </h3>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed ${unlocked ? 'text-daria-text-muted' : 'text-daria-text-dim'}`}>
                      {achievement.description}
                    </p>

                    {/* Condition */}
                    <p className={`text-xs ${unlocked ? 'text-daria-green/70' : 'text-daria-text-dim'}`}>
                      {achievement.condition}
                    </p>

                    {/* Status */}
                    {unlocked && (
                      <span className="inline-flex items-center gap-1 text-xs text-daria-green/80 mt-1">
                        <i className="fas fa-check-circle"></i>
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
