"use client";

import Link from "next/link";
import { useTeaContext } from "@/lib/context/useTeaContext";

/** Weather icon */
function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  if (code === 0) {
    return isDay ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    );
  }
  if (code <= 3)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    );
  if (code >= 51 && code <= 82)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" />
        <line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
      </svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

export default function Dashboard() {
  const { time, weather, season, recommendation, isLoading, locationName } =
    useTeaContext();

  return (
    <div className="space-y-6">
      {/* Greeting + Context strip */}
      <header className="animate-fade-in-up">
        <h1 className="font-serif text-2xl md:text-3xl font-light text-ink">
          {time.greeting}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-ink-muted">
          <span>{time.display}</span>
          <span className="text-steam">&middot;</span>
          <span className="capitalize">{season}</span>
          {!isLoading && weather && (
            <>
              <span className="text-steam">&middot;</span>
              <span className="inline-flex items-center gap-1">
                <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} />
                {Math.round(weather.temperature)}&deg;C
              </span>
              <span className="text-steam">&middot;</span>
              <span>{weather.description}</span>
            </>
          )}
          {locationName && (
            <>
              <span className="text-steam">&middot;</span>
              <span>{locationName}</span>
            </>
          )}
        </div>
      </header>

      {/* =============================================
          Lou — Breathing Orb + Context-Aware Suggestion
          ============================================= */}
      <Link href="/lou" className="block animate-fade-in-up animate-delay-100">
        <section className="relative overflow-hidden rounded-soft border border-steam bg-porcelain p-5 shadow-whisper hover:shadow-soft transition-shadow duration-gentle">
          {/* Subtle background gradient that breathes */}
          <div className="absolute inset-0 bg-gradient-to-br from-jade/[0.03] to-oolong/[0.03] animate-breathe pointer-events-none" />

          <div className="relative flex items-start gap-4">
            {/* Breathing orb */}
            <div className="relative flex shrink-0 items-center justify-center">
              {/* Outer breathing ring */}
              <div className="absolute h-14 w-14 rounded-full bg-jade/10 animate-breathe-ring" />
              {/* Glow */}
              <div className="absolute h-11 w-11 rounded-full animate-breathe-glow" />
              {/* Core orb */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-jade to-jade-dark animate-breathe">
                {/* Leaf icon — Lou's signature */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-porcelain">
                  <path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 .5 20 .5s-1.5 5-4.5 8.5c-2 2.3-4.5 3.5-4.5 3.5" />
                  <path d="M6.7 17.3c3-3 4.3-7.3 4.3-7.3" />
                </svg>
              </div>
              {/* Steam wisps */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <div className="w-[2px] h-3 bg-jade/30 rounded-full animate-steam mx-auto" />
              </div>
              <div className="absolute -top-0.5 left-1/2 -translate-x-[3px]">
                <div className="w-[2px] h-2.5 bg-jade/20 rounded-full animate-steam-delayed" />
              </div>
              <div className="absolute -top-0.5 left-1/2 translate-x-[1px]">
                <div className="w-[1.5px] h-2 bg-jade/20 rounded-full animate-steam-slow" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-ink">Lou suggests</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-oolong/10 text-oolong">
                  {recommendation.tea}
                </span>
              </div>

              {isLoading ? (
                <div className="mt-2 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-steam animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-steam animate-pulse" />
                </div>
              ) : (
                <p className="mt-1.5 text-sm leading-relaxed text-ink-light">
                  {recommendation.reason}
                </p>
              )}

              <span className="mt-3 inline-block text-sm text-jade">
                Start a session &rarr;
              </span>
            </div>
          </div>
        </section>
      </Link>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-200">
        <Link
          href="/rituals"
          className="group flex flex-col items-center gap-2.5 rounded-soft border border-steam bg-porcelain p-5 shadow-whisper hover:shadow-soft transition-all duration-gentle active:scale-[0.97]"
        >
          {/* Tea cup with steam */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-jade transition-transform duration-gentle group-hover:scale-110">
              <path d="M17 8h1a4 4 0 110 8h-1" />
              <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
            </svg>
            {/* Mini steam */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-[2px]">
              <div className="w-[1px] h-2 bg-jade/25 rounded-full animate-steam" />
              <div className="w-[1px] h-1.5 bg-jade/20 rounded-full animate-steam-delayed" />
            </div>
          </div>
          <span className="text-sm text-ink">Log a Ritual</span>
        </Link>

        <Link
          href="/marketplace"
          className="group flex flex-col items-center gap-2.5 rounded-soft border border-steam bg-porcelain p-5 shadow-whisper hover:shadow-soft transition-all duration-gentle active:scale-[0.97]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-oolong transition-transform duration-gentle group-hover:scale-110">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <span className="text-sm text-ink">Browse Teas</span>
        </Link>
      </div>

      {/* Recent rituals */}
      <section className="rounded-soft border border-steam bg-porcelain p-5 shadow-whisper animate-fade-in-up animate-delay-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-ink">Recent Rituals</h2>
          <Link
            href="/rituals"
            className="text-xs text-jade hover:text-jade-dark transition-colors duration-gentle"
          >
            View all
          </Link>
        </div>
        <div className="space-y-1">
          {[
            {
              tea: "Da Hong Pao",
              date: "Today, 10:30",
              note: "Roasted chestnut, lingering sweetness",
              mood: "Focused",
            },
            {
              tea: "Jasmin Snow Buds",
              date: "Yesterday, 16:00",
              note: "Floral, clean, meditative",
              mood: "Calm",
            },
            {
              tea: "Da Hong Pao",
              date: "2 Apr, 09:15",
              note: "Rich mineral body, calm focus",
              mood: "Present",
            },
          ].map((ritual, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-subtle px-3 py-3 hover:bg-parchment transition-colors duration-gentle cursor-pointer active:bg-parchment-warm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{ritual.tea}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-jade/8 text-jade-dark">
                    {ritual.mood}
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5 truncate">
                  {ritual.note}
                </p>
              </div>
              <span className="text-[11px] text-ink-muted whitespace-nowrap ml-3">
                {ritual.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="rounded-soft border border-steam bg-porcelain p-5 shadow-whisper animate-fade-in-up animate-delay-400">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-ink">From the Marketplace</h2>
          <Link
            href="/marketplace"
            className="text-xs text-jade hover:text-jade-dark transition-colors duration-gentle"
          >
            Browse all
          </Link>
        </div>
        <div className="space-y-1">
          {[
            {
              tea: "Da Hong Pao",
              type: "Oolong",
              origin: "Wuyi Mountains, Fujian",
            },
            {
              tea: "Jasmin Snow Buds",
              type: "Green Tea",
              origin: "Fuding, Fujian",
            },
          ].map((tea, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-subtle px-3 py-3 hover:bg-parchment transition-colors duration-gentle cursor-pointer active:bg-parchment-warm"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{tea.tea}</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {tea.type} &middot; {tea.origin}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-jade/10 text-jade shrink-0 ml-3">
                Théorea
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
