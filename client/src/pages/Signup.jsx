// client/src/pages/Signup.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp } from '../lib/auth-client'
import { PasswordInput } from '../components/PasswordInput'

export function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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

    setLoading(true)
    const { error: signupError } = await signUp.email({ name, email, password })

    if (signupError) {
      setError(signupError.message || 'Signup failed. Try again.')
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
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="mt-2 text-sm text-zinc-400">Join Pulse Fitness today.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <label htmlFor="signup-name" className="mt-6 block text-sm font-semibold text-zinc-300">
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-emerald-400"
        />

        <label htmlFor="signup-email" className="mt-4 block text-sm font-semibold text-zinc-300">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-emerald-400"
        />

        <label htmlFor="signup-password" className="mt-4 block text-sm font-semibold text-zinc-300">
          Password
        </label>
        <div className="mt-1">
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
          />
        </div>

        <label htmlFor="signup-confirm" className="mt-4 block text-sm font-semibold text-zinc-300">
          Confirm Password
        </label>
        <div className="mt-1">
          <PasswordInput
            id="signup-confirm"
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
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}