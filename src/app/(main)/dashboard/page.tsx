"use client";

import Link from "next/link";
import { useTeaContext } from "@/lib/context/useTeaContext";

/** Weather icon based on code */
function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  if (code === 0) {
    return isDay ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    );
  }
  if (code <= 3) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    );
  }
  if (code >= 51 && code <= 82) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" />
        <line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

export default function Dashboard() {
  const { time, weather, season, recommendation, isLoading, locationName } =
    useTeaContext();

  return (
    <div className="space-y-6">
      {/* Greeting + Context bar */}
      <header>
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

      {/* Lou's context-aware suggestion */}
      <section className="rounded-soft border border-steam bg-porcelain p-5 shadow-whisper">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jade/10 text-jade">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-ink">Lou suggests</h3>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-oolong/10 text-oolong">
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

            <Link
              href="/lou"
              className="mt-3 inline-block text-sm text-jade hover:text-jade-dark transition-colors duration-gentle"
            >
              Start a session with Lou &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions — large touch targets for mobile */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/rituals"
          className="flex flex-col items-center gap-2 rounded-soft border border-steam bg-porcelain p-4 shadow-whisper hover:shadow-soft transition-all duration-gentle active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-jade">
            <path d="M17 8h1a4 4 0 110 8h-1" />
            <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
            <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
          </svg>
          <span className="text-sm text-ink">Log a Ritual</span>
        </Link>
        <Link
          href="/marketplace"
          className="flex flex-col items-center gap-2 rounded-soft border border-steam bg-porcelain p-4 shadow-whisper hover:shadow-soft transition-all duration-gentle active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-oolong">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <span className="text-sm text-ink">Browse Teas</span>
        </Link>
      </div>

      {/* Recent rituals */}
      <section className="rounded-soft border border-steam bg-porcelain p-5 shadow-whisper">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-ink">Recent Rituals</h2>
          <Link
            href="/rituals"
            className="text-xs text-jade hover:text-jade-dark transition-colors duration-gentle"
          >
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {[
            {
              tea: "Da Hong Pao",
              date: "Today, 10:30",
              note: "Roasted chestnut, lingering sweetness",
            },
            {
              tea: "Jasmin Snow Buds",
              date: "Yesterday, 16:00",
              note: "Floral, clean, meditative",
            },
            {
              tea: "Da Hong Pao",
              date: "2 Apr, 09:15",
              note: "Rich mineral body, calm focus",
            },
          ].map((ritual, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-subtle px-3 py-2.5 hover:bg-parchment transition-colors duration-gentle cursor-pointer active:bg-parchment-warm"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{ritual.tea}</p>
                <p className="text-xs text-ink-muted mt-0.5 truncate">
                  {ritual.note}
                </p>
              </div>
              <span className="text-xs text-ink-muted whitespace-nowrap ml-3">
                {ritual.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="rounded-soft border border-steam bg-porcelain p-5 shadow-whisper">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-ink">From the Marketplace</h2>
          <Link
            href="/marketplace"
            className="text-xs text-jade hover:text-jade-dark transition-colors duration-gentle"
          >
            Browse all
          </Link>
        </div>
        <div className="space-y-2">
          {[
            {
              tea: "Da Hong Pao",
              origin: "Wuyi Mountains, Fujian",
              badge: "Théorea",
            },
            {
              tea: "Jasmin Snow Buds",
              origin: "Fuding, Fujian",
              badge: "Théorea",
            },
          ].map((tea, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-subtle px-3 py-2.5 hover:bg-parchment transition-colors duration-gentle cursor-pointer active:bg-parchment-warm"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{tea.tea}</p>
                <p className="text-xs text-ink-muted mt-0.5">{tea.origin}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-jade/10 text-jade shrink-0 ml-3">
                {tea.badge}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
