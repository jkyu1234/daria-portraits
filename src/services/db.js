import { supabase } from '../lib/supabase'

// ---- Chat Sessions ----

export async function createSession(userId, title = 'New Chat') {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getSessions(userId) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateSessionTitle(sessionId, title) {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
  if (error) throw error
}

export async function deleteSession(sessionId) {
  const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId)
  if (error) throw error
}

// ---- Chat Messages ----

export async function saveMessage(userId, sessionId, role, content, emotionScore = 5, affectionDelta = 0) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      session_id: sessionId,
      role,
      content,
      emotion_score: emotionScore,
      affection_delta: affectionDelta
    })
    .select()
    .single()
  if (error) throw error

  // Also update session's updated_at
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId)

  return data
}

export async function getSessionMessages(sessionId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

// ---- Affection History ----

export async function recordAffectionChange(userId, sessionId, scoreBefore, scoreAfter, delta) {
  const { error } = await supabase
    .from('affection_history')
    .insert({
      user_id: userId,
      session_id: sessionId,
      score_before: scoreBefore,
      score_after: scoreAfter,
      delta
    })
  if (error) throw error
}

export async function getAffectionTimeline(userId) {
  const { data, error } = await supabase
    .from('affection_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ---- User Stats (for dashboard) ----

export async function getUserStats(userId) {
  // Get all messages for this user
  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)

  if (error || !messages) return null

  // Calculate stats
  const userMessages = messages.filter(m => m.role === 'user')
  const totalMessages = userMessages.length
  const pizzaCount = userMessages.filter(m => (m.content || '').toLowerCase().includes('pizza')).length
  const sswCount = userMessages.filter(m => (m.content || '').toLowerCase().includes('sick sad world')).length
  const quinnCount = userMessages.filter(m => (m.content || '').toLowerCase().includes('quinn')).length
  const highScoreCount = messages.filter(m => m.emotion_score >= 8).length
  const lowScoreCount = messages.filter(m => m.emotion_score <= 1).length

  // Session stats
  const sessionIds = [...new Set(messages.map(m => m.session_id))]
  let maxSessionRounds = 0
  for (const sid of sessionIds) {
    const count = messages.filter(m => m.session_id === sid).length
    if (count > maxSessionRounds) maxSessionRounds = count
  }

  // Time stats
  const firstMsg = messages[0]
  const lastMsg = messages[messages.length - 1]
  const daysSinceFirst = firstMsg ? Math.floor((Date.now() - new Date(firstMsg.created_at).getTime()) / 86400000) : 0
  const daysSinceLastMessage = lastMsg ? Math.floor((Date.now() - new Date(lastMsg.created_at).getTime()) / 86400000) : 0

  // Night owl: messages between 0-5 AM
  const nightCount = messages.filter(m => {
    const hour = new Date(m.created_at).getHours()
    return hour >= 0 && hour < 5
  }).length

  return {
    totalMessages,
    pizzaCount,
    sswCount,
    quinnCount,
    highScoreCount,
    lowScoreCount,
    maxSessionRounds,
    daysSinceFirst,
    daysSinceLastMessage,
    nightCount,
    isRegistered: true,
    affectionLevel: 1, // will be computed by frontend
  }
}

// ---- Achievements ----

export async function getUnlockedAchievements(userId) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_key')
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map(a => a.achievement_key)
}

export async function unlockAchievement(userId, achievementKey) {
  const { error } = await supabase
    .from('user_achievements')
    .upsert({ user_id: userId, achievement_key: achievementKey, unlocked_at: new Date().toISOString() },
      { onConflict: 'user_id, achievement_key' })
  if (error) throw error
}

// ---- Social Media ----

export async function getSocialEntries() {
  const { data, error } = await supabase
    .from('daria_social_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data || []
}

export async function addSocialReaction(userId, entryId, reaction) {
  const { error } = await supabase
    .from('social_reactions')
    .upsert({ user_id: userId, entry_id: entryId, reaction },
      { onConflict: 'user_id, entry_id, reaction' })
  if (error) throw error
}

export async function getSocialReactions(entryId) {
  const { data, error } = await supabase
    .from('social_reactions')
    .select('reaction')
    .eq('entry_id', entryId)
  if (error) throw error
  const counts = { like: 0, laugh: 0, think: 0 }
  for (const r of (data || [])) {
    if (counts[r.reaction] !== undefined) counts[r.reaction]++
  }
  return counts
}
