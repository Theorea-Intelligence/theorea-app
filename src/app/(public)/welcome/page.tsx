"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/supabase/client";
import { trackLogin, trackLoginError } from "@/lib/analytics/gtag";
import LouOrb from "@/components/ui/LouOrb";

/** Inner component that uses useSearchParams (must be inside Suspense) */
function WelcomeContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const searchParams = useSearchParams();
  const router = useRouter();

  // Pick up OAuth error from callback redirect
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setMessage(decodeURIComponent(error));
      setMessageType("error");
    }
  }, [searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email");
    setMessage("");

    const { error } = await signInWithEmail(email);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      trackLoginError("email", error.message);
    } else {
      setMessage("Check your email for the magic link.");
      setMessageType("success");
      trackLogin("email_otp");
    }
    setLoading(null);
  };

  const handleGoogleSignIn = async () => {
    setLoading("google");
    setMessage("");

    const { error } = await signInWithGoogle();

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      trackLoginError("google", error.message);
      setLoading(null);
    }
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

      {/* Bottom: Sign-in options */}
      <div className="w-full max-w-[320px] animate-fade-in-up animation-delay-300">
        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-porcelain px-4 py-3.5 text-[14px] font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading === "google" ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-black/[0.06]" />
          <span className="text-[11px] text-ink-muted/50 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-black/[0.06]" />
        </div>

        {/* Email magic link */}
        <form onSubmit={handleEmailSignIn} className="space-y-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3.5 bg-porcelain border border-black/[0.06] rounded-2xl text-[14px] text-ink text-center placeholder:text-ink-muted/40 focus:outline-none focus:border-oolong/40 transition-colors duration-200"
            required
            disabled={loading !== null}
          />
          <button
            type="submit"
            disabled={loading !== null}
            className="w-full px-4 py-3.5 border border-black/[0.08] text-ink text-[14px] font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading === "email" ? "Sending..." : "Continue with email"}
          </button>
        </form>

        {/* Status message */}
        {message && (
          <p
            className={`text-[12px] text-center mt-3 ${
              messageType === "success" ? "text-jade" : "text-oolong-dark"
            }`}
          >
            {message}
          </p>
        )}

        {/* Skip link */}
        <button
          onClick={() => router.push("/dashboard")}
          className="block w-full text-[11px] text-ink-muted/30 text-center mt-5 active:text-ink-muted transition-colors"
        >
          Browse as guest
        </button>

        {/* Legal */}
        <p className="text-[10px] text-ink-muted/30 text-center mt-3 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}

/** Wrapper with Suspense boundary (required by Next.js 15 for useSearchParams) */
export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[100dvh] items-center justify-center bg-parchment">
          <LouOrb variant="hero" />
        </main>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
