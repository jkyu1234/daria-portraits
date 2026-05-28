import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthModal({ onClose }) {
  const { signUp, signIn, signInWithGoogle, signInWithGithub } = useAuth()
  const [tab, setTab] = useState('login')

  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      onClose()
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, nickname)
      onClose()
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Google sign in failed')
    }
  }

  const handleGithub = async () => {
    setError('')
    try {
      await signInWithGithub()
    } catch (err) {
      setError(err.message || 'Github sign in failed')
    }
  }

  const switchTab = (t) => {
    setTab(t)
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-daria-surface rounded-card w-full max-w-md mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-daria-text-muted hover:text-white transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="flex border-b border-daria-border mb-6">
          <button
            className={`flex-1 pb-3 text-center font-medium transition-colors ${
              tab === 'login'
                ? 'text-daria-green border-b-2 border-daria-green'
                : 'text-daria-text-muted hover:text-daria-text'
            }`}
            onClick={() => switchTab('login')}
          >
            <i className="fas fa-sign-in-alt mr-2"></i>Login
          </button>
          <button
            className={`flex-1 pb-3 text-center font-medium transition-colors ${
              tab === 'register'
                ? 'text-daria-green border-b-2 border-daria-green'
                : 'text-daria-text-muted hover:text-daria-text'
            }`}
            onClick={() => switchTab('register')}
          >
            <i className="fas fa-user-plus mr-2"></i>Register
          </button>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-daria-text text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-daria-bg border border-daria-border rounded-input px-3 py-2 text-daria-text focus:outline-none focus:border-daria-green transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-daria-text text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-daria-bg border border-daria-border rounded-input px-3 py-2 text-daria-text focus:outline-none focus:border-daria-green transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-daria-green hover:bg-daria-green-bright text-white font-medium py-2 rounded-button transition-colors disabled:opacity-50 font-heading"
            >
              {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-daria-text text-sm mb-1">Nickname <span className="text-daria-text-dim">(optional)</span></label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-daria-bg border border-daria-border rounded-input px-3 py-2 text-daria-text focus:outline-none focus:border-daria-green transition-colors"
                placeholder="Daria Fan"
              />
            </div>
            <div className="mb-4">
              <label className="block text-daria-text text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-daria-bg border border-daria-border rounded-input px-3 py-2 text-daria-text focus:outline-none focus:border-daria-green transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-daria-text text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-daria-bg border border-daria-border rounded-input px-3 py-2 text-daria-text focus:outline-none focus:border-daria-green transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-daria-green hover:bg-daria-green-bright text-white font-medium py-2 rounded-button transition-colors disabled:opacity-50 font-heading"
            >
              {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
              Register
            </button>
          </form>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleGoogle}
            className="w-full bg-daria-surface hover:bg-daria-border text-daria-text font-medium py-2 rounded-button transition-colors flex items-center justify-center gap-2 border border-daria-border"
          >
            <i className="fab fa-google"></i>
            Continue with Google
          </button>
          <button
            onClick={handleGithub}
            className="w-full bg-daria-surface hover:bg-daria-border text-daria-text font-medium py-2 rounded-button transition-colors flex items-center justify-center gap-2 border border-daria-border"
          >
            <i className="fab fa-github"></i>
            Continue with GitHub
          </button>
        </div>

        {tab === 'login' && (
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-daria-text-muted hover:text-daria-text text-sm transition-colors"
            >
              <i className="fas fa-user mr-1"></i>Continue as Guest
            </button>
          </div>
        )}

        {tab === 'register' && (
          <div className="mt-4 text-center">
            <span className="text-daria-text-muted text-sm">
              Already have an account?{' '}
              <button
                onClick={() => switchTab('login')}
                className="text-daria-green hover:underline"
              >
                Login
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
