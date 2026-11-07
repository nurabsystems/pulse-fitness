// client/src/pages/MemberDashboard.jsx
// This is the dashboard where a logged-in user can manage their profile.

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../lib/auth-client';

// The Server or Backend API URL. It uses the environment variable if available.
// If not, it falls back to the live Render backend for production.
const API_URL = import.meta.env.VITE_API_URL || 'https://pulse-fitness-y1fa.onrender.com/api';

export function MemberDashboard() {
  // 1. Get the current session (to know who is logged in).
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  // 2. State for the user's profile data.
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // 3. State for UI feedback.
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 4. A reference to the hidden file input (for avatar upload).
  const fileInputRef = useRef(null);

  // 5. If the user is not logged in, redirect them to the login page.
  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate('/login?redirect=/dashboard');
    }
  }, [session, isPending, navigate]);

  // 6. When the page loads, fetch the user's profile from the backend.
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          credentials: 'include', // This sends the session cookie.
        });
        const data = await res.json();

        if (data.user) {
          setProfile(data.user);
          setName(data.user.name || '');
          setBio(data.user.bio || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false); // Stop the loading spinner.
      }
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  // 7. When the user clicks "Save Changes", send the data to the backend.
  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send the cookie.
        body: JSON.stringify({ name, bio }),
      });

      const data = await res.json();

      if (data.user) {
        setProfile(data.user);
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // 8. When the user picks a new avatar file, upload it.
  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file); // 'avatar' must match the backend field name.

    try {
      const res = await fetch(`${API_URL}/users/me/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData, // No 'Content-Type' header! FormData sets it automatically.
      });

      const data = await res.json();

      if (data.user) {
        setProfile(data.user);
        setMessage('Avatar updated successfully!');
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setMessage('Failed to upload avatar. Please try again.');
    }
  }

  // 9. If still loading, show a simple loading message.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // 10. The main dashboard UI.
  return (
    <section className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="mt-2 text-zinc-400">Manage your profile and account settings.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Left Sidebar: Avatar and User Info --- */}
          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex flex-col items-center">
              {/* Avatar Image */}
              <div className="relative">
                <img
                  src={
                    profile?.image ||
                    // If no avatar is uploaded, generate a nice placeholder using the user's initials.
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile?.name || 'User'
                    )}&background=10b981&color=fff&size=128`
                  }
                  alt={profile?.name || 'User'}
                  className="h-24 w-24 rounded-full object-cover border-2 border-emerald-400"
                />

                {/* Camera button (hidden file input) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-emerald-400 p-2 text-black hover:bg-emerald-500"
                  title="Upload avatar"
                >
                  📷
                </button>

                {/* The actual file input, hidden from view */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <h2 className="mt-4 text-lg font-bold">{profile?.name}</h2>
              <p className="text-sm text-zinc-400">{profile?.email}</p>

              {/* Role Badge */}
              <span className="mt-2 inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                {profile?.role || 'Member'}
              </span>
            </div>
          </aside>

          {/* --- Right Side: Profile Edit Form --- */}
          <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-xl font-bold">Edit Profile</h3>
            <p className="mt-1 text-sm text-zinc-400">Update your personal details below.</p>

            {/* Success / Error Message */}
            {message && (
              <div className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
                {message}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              {/* Name field */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                />
              </div>

              {/* Email field (disabled) */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300">Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-zinc-500 outline-none cursor-not-allowed"
                />
              </div>

              {/* Bio field */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}