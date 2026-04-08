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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    <main className="flex min-h-[100dvh] flex-col items-center justify-between px-8 py-12 safe-top safe-bottom bg-parchment">
      {/* Top spacer */}
      <div />

      {/* Centre: Brand + breathing orb */}
      <div className="flex flex-col items-center text-center">
        {/* Breathing orb — Lou's presence */}
        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute h-28 w-28 rounded-full bg-oolong/10 animate-breathe-ring" />
          <div className="absolute h-20 w-20 rounded-full animate-breathe-glow" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-oolong to-oolong-dark animate-breathe shadow-lift">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-porcelain">
              <path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 .5 20 .5s-1.5 5-4.5 8.5c-2 2.3-4.5 3.5-4.5 3.5" />
              <path d="M6.7 17.3c3-3 4.3-7.3 4.3-7.3" />
            </svg>
          </div>
          {/* Steam wisps */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-[2px] h-4 bg-oolong/25 rounded-full animate-steam mx-auto" />
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-[5px]">
            <div className="w-[2px] h-3 bg-oolong/15 rounded-full animate-steam-delayed" />
          </div>
          <div className="absolute -top-1 left-1/2 translate-x-[3px]">
            <div className="w-[1.5px] h-2.5 bg-oolong/15 rounded-full animate-steam-slow" />
          </div>
        </div>

        <p className="text-ink-muted text-[11px] tracking-[0.25em] uppercase mb-3 animate-fade-in-up">
          Maison Théorea
        </p>

        <h1 className="font-serif text-3xl font-light tracking-tight text-ink mb-2 animate-fade-in-up animation-delay-100">
          Théorea
        </h1>

        <p className="text-ink-muted text-sm leading-relaxed max-w-[260px] animate-fade-in-up animation-delay-200">
          Your pocket tea sommelier.
          Discover, taste, reflect.
        </p>
      </div>

      {/* Bottom: Sign-in form */}
      <div className="w-full max-w-[320px] animate-fade-in-up animation-delay-300">
        <form onSubmit={handleSignIn} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3.5 bg-porcelain border border-steam rounded-2xl text-sm text-ink text-center placeholder:text-ink-muted/50 focus:outline-none focus:border-oolong/40 transition-colors duration-gentle"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3.5 bg-ink text-porcelain text-sm font-medium tracking-wide rounded-2xl transition-all duration-gentle hover:bg-ink/90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Continue"}
          </button>
        </form>
        {message && (
          <p className={`text-xs text-center mt-3 ${message.includes("Check") ? "text-jade" : "text-oolong-dark"}`}>
            {message}
          </p>
        )}
        <p className="text-[11px] text-ink-muted/50 text-center mt-4">
          We&apos;ll send you a magic link to sign in.
        </p>
      </div>
    </main>
  );
}
