// client/src/pages/ResetPassword.jsx
import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import { PasswordInput } from '../components/PasswordInput'

export function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!token) {
      setError('Missing reset token. Please request a new link.')
      return
    }

    setLoading(true)
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message || 'Password reset failed. Link may be expired.')
      return
    }

    navigate('/login')
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <h1 className="text-xl font-bold text-white">Invalid Reset Link</h1>
          <p className="mt-2 text-sm text-zinc-400">
            This password reset link is invalid or expired.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black"
          >
            Request new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your new password below.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <label htmlFor="reset-password" className="mt-6 block text-sm font-semibold text-zinc-300">
          New Password
        </label>
        <div className="mt-1">
          <PasswordInput
            id="reset-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
          />
        </div>

        <label htmlFor="reset-confirm" className="mt-4 block text-sm font-semibold text-zinc-300">
          Confirm New Password
        </label>
        <div className="mt-1">
          <PasswordInput
            id="reset-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
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