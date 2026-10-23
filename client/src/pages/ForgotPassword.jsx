// client/src/pages/ForgotPassword.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authClient } from '../lib/auth-client'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { error: reqError } = await authClient.forgetPassword({
      email,
      redirectTo: '/reset-password',
    })

    setLoading(false)

    if (reqError) {
      setError(reqError.message || 'Failed to send reset email.')
      return
    }

    setMessage(
      'If an account exists with that email, you will receive a reset link shortly.'
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your email and we'll send you a reset link.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400">
            {message}
          </p>
        )}

        <label htmlFor="forgot-email" className="mt-6 block text-sm font-semibold text-zinc-300">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-emerald-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          <Link to="/login" className="text-emerald-400 hover:underline">
            ← Back to Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}