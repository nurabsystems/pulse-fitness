// client/src/components/ClassFormModal.jsx
// Modal form for creating and editing classes.

import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function ClassFormModal({ classData, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    day: classData?.day || 'Monday',
    time: classData?.time || '07:00',
    name: classData?.name || '',
    trainer: classData?.trainer || '',
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
      setError(err.message || 'Failed to save class');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {classData ? 'Edit Class' : 'Add New Class'}
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
            <label className="block text-sm font-semibold text-zinc-300">Day</label>
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300">Time (HH:MM)</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300">Class Name</label>
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
            <label className="block text-sm font-semibold text-zinc-300">Trainer</label>
            <input
              type="text"
              name="trainer"
              value={form.trainer}
              onChange={handleChange}
              required
              placeholder="Trainer name"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : classData ? 'Save Changes' : 'Create Class'}
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