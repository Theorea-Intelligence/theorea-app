"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut } from "@/lib/supabase/client";
import { useLocale } from "@/i18n/LocaleContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLocale();
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string; provider?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({
          email: u.email,
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0],
          avatar: u.user_metadata?.avatar_url,
          provider: u.app_metadata?.provider || "email",
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/welcome");
  };

  const displayName = user?.name || t.profile.guest;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Profile header card */}
      <section className="rounded-2xl bg-porcelain p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up">
        <div className="flex items-center gap-3.5">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-oolong to-oolong-dark text-porcelain font-serif text-lg">
              {initial}
            </div>
          )}
          <div>
            <h1 className="text-[17px] font-medium text-ink">{displayName}</h1>
            <p className="text-[13px] text-ink-muted">
              {user?.email || "Guest"}
              {user?.provider && user.provider !== "email" && (
                <span className="text-ink-muted/40"> &middot; {user.provider}</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2.5 animate-fade-in-up animation-delay-100">
        {[
          { label: t.profile.rituals, value: "12" },
          { label: t.profile.teas, value: "2" },
          { label: t.profile.days, value: "7" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl bg-porcelain p-3.5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <p className="font-serif text-[22px] text-ink">{stat.value}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tea Preferences */}
      <section className="rounded-2xl bg-porcelain shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-200">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">{t.profile.teaPreferences}</h2>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { label: t.profile.preferredTypes, value: "Oolong, Green" },
            { label: t.profile.flavourProfile, value: "Floral, Mineral, Roasted" },
            { label: t.profile.ritualStyle, value: "Gongfu" },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-ink">{pref.label}</span>
              <span className="text-[13px] text-ink-muted">{pref.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Settings — includes Language Switcher */}
      <section className="rounded-2xl bg-porcelain shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-300">
        <div className="divide-y divide-black/[0.04]">
          {[t.profile.account, t.profile.notifications, t.profile.privacy, t.profile.helpSupport].map((item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between px-4 py-3.5 active:bg-parchment transition-colors"
            >
              <span className="text-[14px] text-ink">{item}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted/30">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
          {/* Language switcher — inline in settings list */}
          <LanguageSwitcher />
        </div>
      </section>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full rounded-2xl bg-porcelain py-3.5 text-[14px] text-oolong-dark font-medium shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform duration-200 animate-fade-in-up animation-delay-400"
      >
        {t.profile.signOut}
      </button>
    </div>
  );
}
