import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authService from '../services/auth'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function init() {
      const currentUser = await authService.getCurrentUser()
      if (ignore) return

      setUser(currentUser)
      if (currentUser) {
        let p = await authService.getUserProfile(currentUser.id)
        if (!p) {
          const { data: newProfile, error } = await supabase
            .from('user_profiles')
            .insert({ id: currentUser.id, nickname: '', avatar_url: '' })
            .select()
            .single()
          if (!error) p = newProfile
        }
        if (!ignore) setProfile(p)
      }
      setLoading(false)
    }

    init()

    const { data: subscription } = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser)
      if (authUser) {
        let p = await authService.getUserProfile(authUser.id)
        if (!p) {
          const { data: newProfile, error } = await supabase
            .from('user_profiles')
            .insert({ id: authUser.id, nickname: '', avatar_url: '' })
            .select()
            .single()
          if (!error) p = newProfile
        }
        setProfile(p)
      } else {
        setProfile(null)
      }
    })

    return () => {
      ignore = true
      subscription?.unsubscribe?.()
    }
  }, [])

  const signUp = useCallback(async (email, password, nickname) => {
    return authService.signUp(email, password, nickname)
  }, [])

  const signIn = useCallback(async (email, password) => {
    return authService.signIn(email, password)
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    return authService.signInWithGoogle()
  }, [])

  const signInWithGithub = useCallback(async () => {
    return authService.signInWithGithub()
  }, [])

  const isGuest = !user && !loading

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isGuest,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      signInWithGithub,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
