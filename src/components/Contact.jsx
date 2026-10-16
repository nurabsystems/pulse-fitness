// Contact — form with controlled inputs.
// Demonstrates the controlled component pattern at the form level.

import { useState } from "react";

export function Contact({ userName, onNameCapture }) {
  // One state object holds all form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Generic change handler — works for any input
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Capture the name for personalization in other sections
    onNameCapture(form.name)   
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="contact" className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
        <div className="rounded-2xl border-2 border-emerald-400 bg-zinc-900 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400 text-3xl text-emerald-400">
            ✓
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">
            {userName ? `Thank you, ${userName}.` : 'Thank you!'}
    </h2>
          <p className="mt-2 text-zinc-400">
            We've received your message. Our team will get back to you within 24
            hours.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm({ name: "", email: "", plan: "", message: "" });
            }}
            className="mt-6 rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400 hover:text-black"
          >
            Send another message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Get in Touch
        </h2>
        <p className="mt-2 text-zinc-400">
          Questions about membership? Send us a message.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-zinc-300"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        <div>
          <label
            htmlFor="plan"
            className="block text-sm font-semibold text-zinc-300"
          >
            Interested Plan
          </label>
          <select
            id="plan"
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none transition focus:border-emerald-400"
          >
            <option value="">Select a plan</option>
            <option value="basic">Basic — €29/month</option>
            <option value="standard">Standard — €49/month</option>
            <option value="premium">Premium — €79/month</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-zinc-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us what you're looking for..."
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-500 sm:w-auto"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
