"use client";

import Link from "next/link";
import { useTeaContext } from "@/lib/context/useTeaContext";
import LouOrb from "@/components/ui/LouOrb";
import { useLocale } from "@/i18n/LocaleContext";

/** Compact weather icon */
function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const size = 14;
  if (code === 0) {
    return isDay ? (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    );
  }
  if (code >= 51 && code <= 82)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" />
        <line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
      </svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

export default function Dashboard() {
  const { time, weather, season, recommendation, isLoading, locationName } =
    useTeaContext();
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {/* Header — compact, iOS-style */}
      <header className="animate-fade-in-up">
        <h1 className="font-serif text-[22px] font-light text-ink leading-tight">
          {time.greeting}
        </h1>
        {!isLoading && weather && (
          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-ink-muted">
            <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} />
            <span>{Math.round(weather.temperature)}&deg; &middot; {weather.description}</span>
            {locationName && <span>&middot; {locationName}</span>}
          </div>
        )}
      </header>

      {/* Lou card — hero element */}
      <Link href="/lou" className="block animate-fade-in-up animation-delay-100">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink/95 to-ink-light p-5">
          <div className="absolute top-3 left-4 h-16 w-16 rounded-full bg-oolong/20 blur-xl animate-breathe" />

          <div className="relative flex items-start gap-4">
            <div className="shrink-0 mt-0.5">
              <LouOrb variant="card" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-medium text-porcelain/70 uppercase tracking-wider">{t.dashboard.louSuggests}</span>
              </div>
              {isLoading ? (
                <div className="space-y-2 mt-1">
                  <div className="h-3 w-3/4 rounded bg-porcelain/10 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-porcelain/10 animate-pulse" />
                </div>
              ) : (
                <>
                  <p className="text-[15px] font-medium text-porcelain mb-1">
                    {recommendation.tea}
                  </p>
                  <p className="text-[13px] leading-relaxed text-porcelain/60">
                    {recommendation.reason}
                  </p>
                </>
              )}
              <div className="flex items-center gap-1 mt-3">
                <span className="text-[12px] text-oolong-light font-medium">{t.dashboard.startSession}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-oolong-light">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animation-delay-200">
        <Link href="/rituals" className="group">
          <div className="flex flex-col items-start gap-2 rounded-2xl bg-porcelain p-4 active:scale-[0.97] transition-transform duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-jade">
                <path d="M17 8h1a4 4 0 110 8h-1" />
                <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink">{t.dashboard.logRitual}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">{t.dashboard.recordSession}</p>
            </div>
          </div>
        </Link>

        <Link href="/marketplace" className="group">
          <div className="flex flex-col items-start gap-2 rounded-2xl bg-porcelain p-4 active:scale-[0.97] transition-transform duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-oolong/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-oolong">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink">{t.dashboard.browseTeas}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">{t.dashboard.exploreCollection}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent rituals */}
      <section className="rounded-2xl bg-porcelain p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-300">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-ink">{t.dashboard.recent}</h2>
          <Link href="/rituals" className="text-[12px] text-oolong-dark font-medium">
            {t.dashboard.seeAll}
          </Link>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { tea: "Da Hong Pao", time: `${t.dashboard.today}, 10:30`, mood: t.dashboard.focused, note: "Roasted chestnut, lingering sweetness" },
            { tea: "Jasmin Snow Buds", time: `${t.dashboard.yesterday}, 16:00`, mood: t.dashboard.calm, note: "Floral, clean, meditative" },
            { tea: "Da Hong Pao", time: "2 Apr, 09:15", mood: t.dashboard.present, note: "Rich mineral body" },
          ].map((ritual, i) => (
            <div key={i} className="flex items-center py-3 first:pt-0 last:pb-0 active:bg-parchment -mx-1 px-1 rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-ink">{ritual.tea}</p>
                  <span className="text-[10px] px-1.5 py-[1px] rounded-full bg-jade/8 text-jade-dark font-medium">
                    {ritual.mood}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted mt-0.5 truncate">{ritual.note}</p>
              </div>
              <span className="text-[11px] text-ink-muted/50 ml-3 shrink-0">{ritual.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace peek */}
      <section className="rounded-2xl bg-porcelain p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-400">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-ink">{t.dashboard.marketplace}</h2>
          <Link href="/marketplace" className="text-[12px] text-oolong-dark font-medium">
            {t.dashboard.browse}
          </Link>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { tea: "Da Hong Pao", type: t.marketplace.oolong, price: "£28", origin: "Wuyi, Fujian" },
            { tea: "Jasmin Snow Buds", type: t.marketplace.greenTeaScented, price: "£24", origin: "Fuding, Fujian" },
          ].map((tea, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 active:bg-parchment -mx-1 px-1 rounded-lg transition-colors">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink">{tea.tea}</p>
                <p className="text-[11px] text-ink-muted mt-0.5">{tea.type} &middot; {tea.origin}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <span className="text-[13px] font-medium text-ink">{tea.price}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted/40">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
