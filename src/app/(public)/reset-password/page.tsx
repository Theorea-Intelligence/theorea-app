"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePassword, supabase } from "@/lib/supabase/client";
import LouOrb from "@/components/ui/LouOrb";
import { useLocale } from "@/i18n/LocaleContext";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  // Supabase sends a recovery session via the URL hash — wait for it
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setSessionReady(true);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage(t.welcome.passwordTooShort);
      setMessageType("error");
      return;
    }
    if (password !== confirmPassword) {
      setMessage(t.welcome.passwordMismatch);
      setMessageType("error");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
      setMessage(t.welcome.passwordUpdated);
      setMessageType("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-between px-8 py-12 safe-top safe-bottom bg-parchment">
      <div />

      <div className="flex flex-col items-center text-center">
        <div className="mb-8">
          <LouOrb variant="hero" />
        </div>
        <p className="text-ink-muted text-[11px] tracking-[0.25em] uppercase mb-3">
          {t.welcome.brand}
        </p>
        <h1 className="font-serif text-[26px] font-light tracking-tight text-ink mb-1.5">
          {t.welcome.chooseNewPassword}
        </h1>
        <p className="text-ink-muted text-[13px] leading-relaxed max-w-[260px]">
          {t.welcome.chooseNewPasswordSub}
        </p>
      </div>

      <div className="w-full max-w-[320px]">
        {!sessionReady ? (
          <p className="text-[13px] text-ink-muted text-center">
            {t.welcome.verifyingLink}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.welcome.newPassword}
                className="w-full px-4 py-3.5 bg-porcelain border border-black/[0.06] rounded-2xl text-[14px] text-ink text-center placeholder:text-ink-muted/40 focus:outline-none focus:border-oolong/40 transition-colors duration-200 pr-12"
                required
                minLength={8}
                disabled={loading}
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

            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.welcome.confirmPassword}
              className="w-full px-4 py-3.5 bg-porcelain border border-black/[0.06] rounded-2xl text-[14px] text-ink text-center placeholder:text-ink-muted/40 focus:outline-none focus:border-oolong/40 transition-colors duration-200"
              required
              minLength={8}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3.5 bg-ink text-porcelain text-[14px] font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? t.welcome.sending : t.welcome.updatePassword}
            </button>
          </form>
        )}

        {message && (
          <p className={`text-[12px] text-center mt-3 ${messageType === "success" ? "text-jade" : "text-oolong-dark"}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
