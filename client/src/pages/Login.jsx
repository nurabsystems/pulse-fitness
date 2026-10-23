// client/src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn } from '../lib/auth-client'
import { PasswordInput } from '../components/PasswordInput'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signinError } = await signIn.email({ email, password })

    if (signinError) {
      setError(signinError.message || 'Login failed. Try again.')
      setLoading(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="mt-2 text-sm text-zinc-400">Welcome back to Pulse Fitness.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <label htmlFor="login-email" className="mt-6 block text-sm font-semibold text-zinc-300">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-emerald-400"
        />

        <label htmlFor="login-password" className="mt-4 block text-sm font-semibold text-zinc-300">
          Password
        </label>
        <div className="mt-1">
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ✅ Forgot password link */}
        <div className="mt-2 flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-zinc-400 transition hover:text-emerald-400"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}