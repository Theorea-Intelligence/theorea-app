"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import LouOrb from "@/components/ui/LouOrb";

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

      {/* Centre: Brand + breathing dual-leaf orb */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-10">
          <LouOrb variant="hero" />
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

      {/* Bottom: Sign-in form + skip link */}
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
        <Link
          href="/dashboard"
          className="block text-[12px] text-oolong-dark/60 text-center mt-4 active:text-oolong-dark transition-colors"
        >
          Skip for now &rarr;
        </Link>
      </div>
    </main>
  );
}
