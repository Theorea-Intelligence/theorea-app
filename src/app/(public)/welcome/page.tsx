"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function WelcomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the magic link.");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-page">
      {/* Hero */}
      <section className="flex flex-col items-center text-center max-w-2xl mx-auto py-breath">
        <p className="text-ink-muted text-sm tracking-[0.2em] uppercase mb-6 animate-fade-in-up">
          Maison Théorea
        </p>

        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 animate-fade-in-up animation-delay-100">
          Tea as Ritual
        </h1>

        <p className="text-ink-light text-lg md:text-xl leading-relaxed mb-12 max-w-lg animate-fade-in-up animation-delay-200">
          A connoisseur-grade platform for those who believe tea is not a
          beverage — it is a practice. Discover exceptional teas, deepen your
          ritual, and connect with the world&apos;s finest sommeliers.
        </p>

        {/* Magic Link Sign In */}
        <form
          onSubmit={handleSignIn}
          className="w-full max-w-sm flex flex-col gap-3 animate-fade-in-up animation-delay-300"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3.5 bg-porcelain border border-steam rounded-subtle text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-jade transition-colors duration-gentle"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-3.5 bg-jade text-porcelain text-sm tracking-wide rounded-subtle transition-all duration-gentle hover:bg-jade-dark hover:shadow-soft disabled:opacity-50"
          >
            {loading ? "Sending..." : "Enter with Magic Link"}
          </button>
          {message && (
            <p
              className={`text-xs text-center mt-1 ${
                message.includes("Check") ? "text-jade" : "text-oolong-dark"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </section>

      {/* Philosophy */}
      <section className="w-full max-w-3xl mx-auto py-section text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-8">
          Intelligence Through Stillness
        </h2>

        <p className="text-ink-light text-lg leading-relaxed mb-16">
          Théorea is where ancient tea wisdom meets modern intelligence. Our
          pocket tea sommelier, Lou, guides your journey — from your first steep
          to your thousandth. Every recommendation refined. Every ritual
          honoured.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6">
            <h3 className="font-serif text-xl mb-3">Lou</h3>
            <p className="text-ink-muted text-sm leading-relaxed">
              Your pocket tea sommelier. A digital connoisseur who learns your
              palate, guides your brewing, and deepens your practice.
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-serif text-xl mb-3">Ritual</h3>
            <p className="text-ink-muted text-sm leading-relaxed">
              Track your tea journey. Log sessions, tasting notes, and
              mindfulness reflections. Build a living record of your practice.
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-serif text-xl mb-3">Marketplace</h3>
            <p className="text-ink-muted text-sm leading-relaxed">
              A curated collection of exceptional teas — from our signature Da
              Hong Pao and Jasmin Snow Buds to sommelier-selected treasures.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto py-section border-t border-steam text-center">
        <p className="text-ink-muted text-xs tracking-wide">
          &copy; {new Date().getFullYear()} Maison Théorea. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
