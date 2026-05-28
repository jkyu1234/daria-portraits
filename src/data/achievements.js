export const ACHIEVEMENTS = [
  { key: 'first_chat', name: '初次见面', icon: 'fa-comment-dots', description: 'First conversation with Daria', condition: 'Send your first message' },
  { key: 'pizza_friend', name: 'Pizza 之友', icon: 'fa-pizza-slice', description: 'Mentioned pizza 20+ times', condition: 'Say "pizza" 20 times' },
  { key: 'ssw_fan', name: 'Sick Sad World 忠实观众', icon: 'fa-tv', description: 'Mentioned Sick Sad World 10+ times', condition: 'Reference Sick Sad World 10 times' },
  { key: 'quinn_master', name: 'Quinn 吐槽大师', icon: 'fa-face-smile', description: 'Mentioned Quinn 30+ times', condition: 'Mention Quinn 30 times' },
  { key: 'top_level', name: '仅次于 Jane', icon: 'fa-star', description: 'Reached the highest affection level', condition: 'Reach Level 5 affection' },
  { key: 'marathon', name: '马拉松选手', icon: 'fa-person-running', description: '100+ messages in one session', condition: 'Chat 100 rounds in one session' },
  { key: 'mind_reader', name: '读心者', icon: 'fa-brain', description: 'Made Daria score 8+ five times', condition: 'Get 8+ emotion score 5 times' },
  { key: 'social_death', name: '社死现场', icon: 'fa-skull', description: 'Made Daria score 0-1 five times', condition: 'Get 0-1 emotion score 5 times' },
  { key: 'old_friend', name: '老友', icon: 'fa-calendar-check', description: 'Chatted for over 365 days', condition: 'Chat span over 365 days' },
  { key: 'night_owl', name: '夜猫子', icon: 'fa-moon', description: 'Chatted between 0-5 AM 10+ times', condition: 'Late night chats 10 times' },
  { key: 'silence_is_golden', name: '沉默是金', icon: 'fa-face-meh', description: 'Registered but silent for 7 days', condition: 'No messages for 7 days after signup' },
]

export function checkAchievements(userStats) {
  const results = []
  const checks = {
    first_chat: () => userStats.totalMessages > 0,
    pizza_friend: () => userStats.pizzaCount >= 20,
    ssw_fan: () => userStats.sswCount >= 10,
    quinn_master: () => userStats.quinnCount >= 30,
    top_level: () => userStats.affectionLevel >= 5,
    marathon: () => userStats.maxSessionRounds >= 100,
    mind_reader: () => userStats.highScoreCount >= 5,
    social_death: () => userStats.lowScoreCount >= 5,
    old_friend: () => userStats.daysSinceFirst >= 365,
    night_owl: () => userStats.nightCount >= 10,
    silence_is_golden: () => userStats.isRegistered && userStats.daysSinceLastMessage >= 7,
  }
  for (const [key, check] of Object.entries(checks)) {
    if (check()) results.push(key)
  }
  return results
}
