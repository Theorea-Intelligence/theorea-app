"use client";

import { useLocale } from "@/i18n/LocaleContext";

export default function SommeliersPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="animate-fade-in-up">
        <h1 className="font-serif text-[22px] font-light text-ink">{t.sommeliers.title}</h1>
      </header>

      {/* Coming soon */}
      <section className="rounded-2xl bg-porcelain p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-100">
        <div className="flex flex-col items-center text-center py-8">
          <div className="relative flex items-center justify-center mb-5">
            <div className="absolute h-16 w-16 rounded-full bg-oolong/10 animate-breathe-ring" />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-oolong/80 to-oolong-dark/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-porcelain">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
          </div>
          <h2 className="font-serif text-[17px] font-light text-ink mb-1.5">
            {t.sommeliers.communityBrewing}
          </h2>
          <p className="text-[13px] text-ink-muted max-w-[260px] leading-relaxed">
            {t.sommeliers.description}
          </p>
          <button className="mt-5 rounded-2xl bg-ink px-5 py-2.5 text-[13px] font-medium text-porcelain active:scale-[0.97] transition-transform duration-200">
            {t.sommeliers.notifyMe}
          </button>
        </div>
      </section>    </div>

  );
}
