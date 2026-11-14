// client/src/components/TrainerFormModal.jsx
// Modal form for creating and editing trainers.

import { useState } from 'react';

const SPECIALTIES = ['HIIT', 'Strength', 'Yoga'];

export function TrainerFormModal({ trainer, onClose, onSave }) {
  // Initialize form state directly from the trainer prop (or empty for create)
  const [form, setForm] = useState(() => ({
    name: trainer?.name || '',
    specialty: trainer?.specialty || 'HIIT',
    bio: trainer?.bio || '',
    image: trainer?.image || '',
    rating: trainer?.rating || 5,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message || 'Failed to save trainer');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {trainer ? 'Edit Trainer' : 'Add New Trainer'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-500/10 p-2 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-300">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300">Specialty</label>
            <select
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              required
              placeholder="https://res.cloudinary.com/..."
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300">
              Rating (1–5)
            </label>
            <input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="0.1"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : trainer ? 'Save Changes' : 'Create Trainer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}