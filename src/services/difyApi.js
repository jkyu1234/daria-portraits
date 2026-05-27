/**
 * Dify API Service - handles AI chat interface for Daria
 *
 * Config priority:
 * 1. localStorage user settings
 * 2. Dynamic window variables
 * 3. Environment variables (.env files)
 */

function getApiConfig() {
  const localApiKey = typeof window !== 'undefined' ? localStorage.getItem('dify_api_key') : null
  const localBaseUrl = typeof window !== 'undefined' ? localStorage.getItem('dify_base_url') : null
  const windowApiKey = typeof window !== 'undefined' ? window.VITE_DIFY_API_KEY : null
  const windowBaseUrl = typeof window !== 'undefined' ? window.VITE_DIFY_BASE_URL : null
  const envApiKey = import.meta.env.VITE_DIFY_API_KEY
  const envBaseUrl = import.meta.env.VITE_DIFY_BASE_URL

  const API_KEY = localApiKey || windowApiKey || envApiKey
  const BASE_URL = localBaseUrl || windowBaseUrl || envBaseUrl || 'https://api.dify.ai/v1/chat-messages'

  return {
    API_KEY,
    BASE_URL,
    isValid: !!(API_KEY && BASE_URL),
  }
}

export async function sendChatMessage(query, options = {}) {
  const {
    inputs = {},
    response_mode = "blocking",
    conversation_id = "",
    user = "daria-user-001",
    files = null
  } = options

  const config = getApiConfig()

  if (!config.isValid) {
    throw new Error('Missing API configuration. Please set Dify API Key and Base URL in settings or .env file.')
  }

  const headers = {
    "Authorization": `Bearer ${config.API_KEY}`,
    "Content-Type": "application/json"
  }

  const payload = {
    inputs,
    query,
    response_mode,
    conversation_id,
    user,
    ...(files && { files })
  }

  try {
    const response = await fetch(config.BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('API authentication failed. Please check your API Key.')
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    if (result.answer) {
      // 1) Try legacy format: whole answer is JSON with daria_chat/daria_note/daria_score
      try {
        const parsed = JSON.parse(result.answer)
        if (parsed.daria_chat || parsed.elon_chat) {
          return {
            success: true,
            data: {
              daria_chat: parsed.daria_chat || parsed.elon_chat || '',
              daria_note: parsed.daria_note || parsed.elon_x || null,
              daria_score: parsed.daria_score || parsed.elon_score || 5
            },
            raw: result
          }
        }
      } catch { /* not legacy JSON */ }

      // 2) New format: answer text ends with {"score":...,"note":"..."}
      const jsonMatch = result.answer.match(/\{[^{}]*"score"\s*:\s*\d+[^{}]*\}/)
      if (jsonMatch) {
        try {
          const meta = JSON.parse(jsonMatch[0])
          const chatText = result.answer.substring(0, result.answer.indexOf(jsonMatch[0])).trim()
          const noteText = meta.note && meta.note.length > 0 ? meta.note : null
          return {
            success: true,
            data: {
              daria_chat: chatText || result.answer,
              daria_note: noteText,
              daria_score: typeof meta.score === 'number' ? meta.score : 5
            },
            raw: result
          }
        } catch { /* json parse failed, fall through */ }
      }

      // 3) Fallback: plain text answer
      return {
        success: true,
        data: {
          daria_chat: result.answer,
          daria_note: null,
          daria_score: 5
        },
        raw: result
      }
    }

    return {
      success: false,
      error: 'No valid response received',
      raw: result
    }

  } catch (error) {
    console.error('Dify API error:', error)
    return {
      success: false,
      error: error.message,
      data: {
        daria_chat: '...Whatever. The system seems to be down. Try again later.',
        daria_note: null,
        daria_score: 5
      }
    }
  }
}

export function validateApiConfig() {
  const config = getApiConfig()
  return config.isValid
}
