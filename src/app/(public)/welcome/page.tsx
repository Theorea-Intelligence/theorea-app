"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  signUpWithPassword,
  signInWithPassword,
  signInWithGoogle,
  resetPassword,
} from "@/lib/supabase/client";
import { trackLogin, trackSignUp, trackLoginError } from "@/lib/analytics/gtag";
import LouOrb from "@/components/ui/LouOrb";
import { useLocale } from "@/i18n/LocaleContext";

type AuthMode = "login" | "signup" | "forgot";

function WelcomeContent() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setMessage(decodeURIComponent(error));
      setMessageType("error");
    }
    const modeParam = searchParams.get("mode");
    if (modeParam === "login" || modeParam === "signup") {
      setMode(modeParam);
    }
  }, [searchParams]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email");
    setMessage("");

    if (mode === "signup") {
      // Validate password
      if (password.length < 8) {
        setMessage(t.welcome.passwordTooShort);
        setMessageType("error");
        setLoading(null);
        return;
      }
      if (password !== confirmPassword) {
        setMessage(t.welcome.passwordMismatch);
        setMessageType("error");
        setLoading(null);
        return;
      }

      const { data, error } = await signUpWithPassword(email, password, {
        full_name: displayName || email.split("@")[0],
        marketing_consent: marketingConsent,
      });

      if (error) {
        // Map Supabase error messages to friendly British English
        let friendlyError = error.message;
        if (error.message.toLowerCase().includes("already registered") ||
            error.message.toLowerCase().includes("user already exists")) {
          friendlyError = "An account with this email already exists. Please sign in instead.";
        } else if (error.message.toLowerCase().includes("invalid email")) {
          friendlyError = "Please enter a valid email address.";
        } else if (error.message.toLowerCase().includes("password")) {
          friendlyError = "Password must be at least 8 characters.";
        } else if (error.message.toLowerCase().includes("rate limit") ||
                   error.message.toLowerCase().includes("too many")) {
          friendlyError = "Too many attempts. Please wait a moment and try again.";
        }
        setMessage(friendlyError);
        setMessageType("error");
        trackLoginError("email_signup", error.message);
      } else if (data.user && !data.session) {
        // Supabase returns identities: [] when the email is already registered
        // (it doesn't return an error to prevent email enumeration)
        if (data.user.identities && data.user.identities.length === 0) {
          setMessage("An account with this email already exists. Please sign in instead.");
          setMessageType("error");
          trackLoginError("email_signup", "duplicate_email");
        } else {
          // Genuine new user — confirmation email sent
          setMessage(t.welcome.checkEmailSignup);
          setMessageType("success");
          trackSignUp("email");
        }
      } else if (data.session) {
        // Signed in immediately (email confirmation disabled in Supabase)
        trackSignUp("email");
        router.push("/dashboard");
      }
    } else {
      // Login
      const { data, error } = await signInWithPassword(email, password);

      if (error) {
        let friendlyError = error.message;
        if (error.message.toLowerCase().includes("invalid login") ||
            error.message.toLowerCase().includes("invalid credentials") ||
            error.message.toLowerCase().includes("wrong password")) {
          friendlyError = "Incorrect email or password. Please try again.";
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          friendlyError = "Please confirm your email address first. Check your inbox for the verification link we sent you.";
        } else if (error.message.toLowerCase().includes("rate limit") ||
                   error.message.toLowerCase().includes("too many")) {
          friendlyError = "Too many attempts. Please wait a moment and try again.";
        }
        setMessage(friendlyError);
        setMessageType("error");
        trackLoginError("email_login", error.message);
      } else if (data.session) {
        trackLogin("email");
        router.push("/dashboard");
      }
    }
    setLoading(null);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email");
    setMessage("");

    const { error } = await resetPassword(email);
    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
      setMessage(t.welcome.checkEmailReset);
      setMessageType("success");
    }
    setLoading(null);
  };

  const handleGoogleAuth = async () => {
    setLoading("google");
    setMessage("");

    const { error } = await signInWithGoogle();

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      trackLoginError("google", error.message);
      setLoading(null);
    } else {
      if (mode === "signup") {
        trackSignUp("google");
      } else {
        trackLogin("google");
      }
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-between px-8 py-12 safe-top safe-bottom bg-parchment">
      <div />

      {/* Centre: Brand */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-8">
          <LouOrb variant="hero" />
        </div>

        <p className="text-ink-muted text-[11px] tracking-[0.25em] uppercase mb-3 animate-fade-in-up">
          {t.welcome.brand}
        </p>

        <h1 className="font-serif text-[26px] font-light tracking-tight text-ink mb-1.5 animate-fade-in-up animation-delay-100">
          {isForgot
            ? t.welcome.resetPassword
            : isSignup
              ? t.welcome.beginJourney
              : t.welcome.welcomeBack}
        </h1>

        <p className="text-ink-muted text-[13px] leading-relaxed max-w-[260px] animate-fade-in-up animation-delay-200">
          {isForgot
            ? t.welcome.resetPasswordSub
            : isSignup
              ? t.welcome.createAccountSub
              : t.welcome.signInSub}
        </p>
      </div>

      {/* Bottom: Auth form */}
      <div className="w-full max-w-[320px] animate-fade-in-up animation-delay-300">
        {/* Google OAuth — not shown on forgot password */}
        {!isForgot && (
          <>
            <button
              onClick={handleGoogleAuth}
              disabled={loading !== null}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-porcelain px-4 py-3.5 text-[14px] font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {loading === "google"
                ? t.welcome.connecting
                : isSignup
                  ? t.welcome.signUpGoogle
                  : t.welcome.signInGoogle}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-black/[0.06]" />
              <span className="text-[11px] text-ink-muted/50 uppercase tracking-wider">{t.welcome.or}</span>
              <div className="flex-1 h-px bg-black/[0.06]" />
            </div>
          </>
        )}

        {/* Email + Password form */}
        <form onSubmit={isForgot ? handleForgotPassword : handleEmailAuth} className="space-y-2.5">
          {/* Name — signup only */}
          {isSignup && (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.welcome.yourName}
              className="w-full px-4 py-3.5 bg-porcelain border border-black/[0.06] rounded-2xl text-[14px] text-ink text-center placeholder:text-ink-muted/40 focus:outline-none focus:border-oolong/40 transition-colors duration-200"
              disabled={loading !== null}
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.welcome.emailAddress}
            className="w-full px-4 py-3.5 bg-porcelain border border-black/[0.06] rounded-2xl text-[14px] text-ink text-center placeholder:text-ink-muted/40 focus:outline-none focus:border-oolong/40 transition-colors duration-200"
            required
            disabled={loading !== null}
          />

          {/* Password fields — not shown on forgot */}
          {!isForgot && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.welcome.password}
                className="w-full px-4 py-3.5 bg-porcelain border border-black/[0.06] rounded-2xl text-[14px] text-ink text-center placeholder:text-ink-muted/40 focus:outline-none focus:border-oolong/40 transition-colors duration-200 pr-12"
                required
                minLength={8}
                disabled={loading !== null}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted/40"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Confirm password — signup only */}
          {isSignup && (
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.welcome.confirmPassword}
              className="w-full px-4 py-3.5 bg-porcelain border border-black/[0.06] rounded-2xl text-[14px] text-ink text-center placeholder:text-ink-muted/40 focus:outline-none focus:border-oolong/40 transition-colors duration-200"
              required
              minLength={8}
              disabled={loading !== null}
            />
          )}

          {/* Marketing consent — signup only */}
          {isSignup && (
            <label className="flex items-start gap-3 px-1 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-black/10 text-oolong accent-oolong"
              />
              <span className="text-[12px] text-ink-muted leading-relaxed">
                {t.welcome.marketingConsent}
              </span>
            </label>
          )}

          {/* Forgot password link — login only */}
          {mode === "login" && (
            <div className="text-right px-1">
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="text-[12px] text-oolong-dark font-medium active:text-oolong transition-colors"
              >
                {t.welcome.forgotPassword}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading !== null}
            className="w-full px-4 py-3.5 bg-ink text-porcelain text-[14px] font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading === "email"
              ? t.welcome.sending
              : isForgot
                ? t.welcome.sendResetLink
                : isSignup
                  ? t.welcome.createAccount
                  : t.welcome.signIn}
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

        {/* Toggle modes */}
        <p className="text-[12px] text-ink-muted/60 text-center mt-5">
          {isForgot ? (
            <>
              <button
                onClick={() => switchMode("login")}
                className="text-oolong-dark font-medium active:text-oolong transition-colors"
              >
                {t.welcome.backToSignIn}
              </button>
            </>
          ) : isSignup ? (
            <>
              {t.welcome.alreadyHaveAccount}{" "}
              <button
                onClick={() => switchMode("login")}
                className="text-oolong-dark font-medium active:text-oolong transition-colors"
              >
                {t.welcome.signIn}
              </button>
            </>
          ) : (
            <>
              {t.welcome.newToTheorea}{" "}
              <button
                onClick={() => switchMode("signup")}
                className="text-oolong-dark font-medium active:text-oolong transition-colors"
              >
                {t.welcome.createAccount}
              </button>
            </>
          )}
        </p>

        {/* Guest browse */}
        <button
          onClick={() => router.push("/dashboard")}
          className="block w-full text-[11px] text-ink-muted/25 text-center mt-3 active:text-ink-muted transition-colors"
        >
          {t.welcome.browseAsGuest}
        </button>

        {/* Legal */}
        <p className="text-[10px] text-ink-muted/25 text-center mt-3 leading-relaxed">
          {t.welcome.legal}
        </p>
      </div>
    </main>
  );
}

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
